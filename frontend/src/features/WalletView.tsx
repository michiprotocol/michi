import { abi, michiChestHelperAddress } from "@/constants/contracts/MichiChest"
import { tokenABIs } from "@/constants/contracts/tokenABIs"
import { DepositedToken, Token } from "@/constants/types/token"
import { cn, numOfConfirmationsToWaitFor } from "@/lib/utils"
import TokenSelect from "@/shared/TokenSelect"
import { useToast } from "@/shared/ui/use-toast"
import { defaultChain, wagmiConfig } from "@/wagmi"
import { WalletView as WalletViewType } from "@/widgets/WalletItem"
import { TokenboundClient } from "@tokenbound/sdk"
import { BigNumber, BigNumberish, ethers } from "ethers"
import { formatEther, parseEther } from "ethers/lib/utils"
import { useEffect, useMemo, useRef, useState } from "react"
import { Address, Hash } from "viem"
import { useAccount, useReadContract, useWalletClient, useWatchContractEvent, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import SwapToken from "./SwapToken"

export default function WalletView(
  {
    view,
    closeWalletView,
    tokens,
    depositedTokens,
    tokenboundAccount,
    fetchTokensData
  }: {
    view: WalletViewType,
    closeWalletView: () => void,
    tokens: Token[],
    depositedTokens: DepositedToken[],
    tokenboundAccount: Address,
    fetchTokensData: () => void;
  }
) {
  const [selectedToken, setSelectedToken] = useState<Token | DepositedToken | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [withdrawHash, setWithdrawalHash] = useState<Hash>();
  const inputRef = useRef<HTMLInputElement>(null);
  const isDepositView = useMemo(() => view === WalletViewType.DEPOSIT, [view]);
  const tokenABI = useMemo(() => selectedToken && tokenABIs[selectedToken.token_address], [selectedToken])
  const account = useAccount();
  const { toast } = useToast();
  const { writeContractAsync, isPending, data: hash, error } = useWriteContract()
  const { writeContractAsync: writeApprovalContractAsync, isPending: isApprovalPending, data: hashApproval } = useWriteContract()
  const { isLoading: isDepositConfirming, isSuccess: isDepositConfirmed, } =
    useWaitForTransactionReceipt({
      hash,
      confirmations: numOfConfirmationsToWaitFor
    });
  const { isLoading: isApprovalConfirming, isSuccess: isApprovalConfirmed, } =
    useWaitForTransactionReceipt({
      hash: hashApproval,
      confirmations: numOfConfirmationsToWaitFor
    });

  const { isLoading: isWithdrawalConfirming, isSuccess: isWithdrawalConfirmed } =
    useWaitForTransactionReceipt({
      hash: withdrawHash,
      confirmations: numOfConfirmationsToWaitFor,
    })

  const { data: walletClient } = useWalletClient({
    chainId: defaultChain.id,
  })
  const tokenboundClient = new TokenboundClient({
    walletClient: walletClient as any,
    chain: defaultChain as any,
  })

  const maxAmount = useMemo(() => {
    if (selectedToken?.balance) {
      let balance;
      if (isDepositView) {
        const depositedToken = depositedTokens.find((t: DepositedToken) => t.token_address === selectedToken.token_address);
        balance = BigNumber.from(selectedToken.balance).sub(BigNumber.from(depositedToken?.balance || 0));
        balance = balance.lt(0) ? 0 : balance;
      } else {
        balance = selectedToken.balance;
      }
      return Number(formatEther(balance))
    }
  }, [selectedToken?.balance]);

  const { data: selectedTokenAllowance, refetch: refetchSelectedTokenAllowance } = useReadContract({
    config: wagmiConfig,
    chainId: defaultChain.id,
    address: selectedToken?.token_address,
    abi: tokenABI,
    functionName: "allowance",
    args: [
      account.address,
      michiChestHelperAddress
    ]
  })
  const approvedToDeposit = useMemo(
    () => selectedTokenAllowance && Number(formatEther(selectedTokenAllowance as BigNumberish)) >= Number(input),
    [selectedTokenAllowance, input]
  );
  const isLoading = isApprovalConfirming || isApprovalPending || isDepositConfirming || isPending;

  useEffect(() => {
    if (isDepositConfirmed) {
      toast({
        title: "Deposited successfully! 🎉",
        description: `${input} of ${selectedToken?.symbol} were deposited into your account`,
      })
      fetchTokensData();
      setIsProcessing(false);
      closeWalletView();
    }
  }, [isDepositConfirmed]);

  useEffect(() => {
    if (isApprovalConfirmed) {
      refetchSelectedTokenAllowance();
      setIsProcessing(false);

      toast({
        title: "Spending Cap Approved successfully! 🎉",
        description: `${formatEther((selectedTokenAllowance ?? 0) as BigNumberish)} of ${selectedToken?.symbol} was approved for your account.  You can now deposit!`,
      })

      runDeposit();
    }
  }, [isApprovalConfirmed])


  useEffect(() => {
    if (isWithdrawalConfirmed) {
      toast({
        title: "Withdrawn successfully! 🎉",
        description: `${input} of ${selectedToken?.symbol} were withdrawn from your account`,
      })
      fetchTokensData();
      setIsProcessing(false);
      closeWalletView();
    }
  }, [isWithdrawalConfirmed])



  const handleApprove = async (token: Token) => {
    setIsProcessing(true);
    if (!approvedToDeposit) {
      await writeApprovalContractAsync({
        account: account.address,
        abi: tokenABI!,
        chainId: defaultChain.id,
        address: token.token_address,
        functionName: 'approve',
        args: [
          michiChestHelperAddress,
          +(maxAmount || input) * (10 ** 18)
        ],
      }).catch((e) => {
        setIsProcessing(false);
        // 4001 means user rejected the transaction
        if (e.cause?.code !== 4001) {
          toast({
            title: "Error",
            description: e.message,
          })
        }
      })
    }
  }

  const runDeposit = async () => {
    await writeContractAsync({
      account: account.address,
      abi,
      chainId: defaultChain.id,
      address: michiChestHelperAddress,
      functionName: 'depositToken',
      args: [
        selectedToken!.token_address,
        tokenboundAccount,
        +input * (10 ** 18),
        false
      ],
    })
  }

  const handleWithdraw = async (token: DepositedToken) => {
    setIsProcessing(true);
    const ABI = [
      "function transfer(address to, uint256 amount)"
    ];
    const iface = new ethers.utils.Interface(ABI);
    const data = iface.encodeFunctionData("transfer", [
      account.address,
      parseEther(input)
    ])
    const execution = await tokenboundClient.prepareExecution({
      account: tokenboundAccount,
      to: token.token_address,
      value: BigInt(0),
      data
    })

    // @ts-ignore
    const res = await walletClient.sendTransaction(execution);
    setWithdrawalHash(res);
  }

  const closeModal = () => {
    (document.getElementById('close-buy-modal') as HTMLDialogElement).click();
  }

  return (
    <div className="flex flex-col gap-5 text-info w-full">
      <div className="bg-transparent rounded-xl p-2">
        <div className="flex flex-row items-center justify-center gap-5">
          <TokenSelect
            selectedToken={selectedToken}
            setSelectedToken={setSelectedToken}
            resetInput={() => setInput('')}
            tokens={isDepositView ? tokens : depositedTokens}
            isDisabled={isProcessing}
          />
          <div className="flex flex-col relative">
            <input
              ref={inputRef}
              readOnly={isProcessing}
              type="text"
              placeholder="00.00"
              className="input bg-transparent h-[30px] pb-4 rounded-none border-none !outline-none w-full max-w-[140px]"
              value={input}
              onChange={(e) => {
                if (!selectedToken) return;
                if (Number(e.target.value) <= maxAmount!) {
                  setInput(e.target.value)
                }
              }}
            />
            <div className="absolute bottom-0 text-info/50 text-xs" onClick={() => inputRef.current!.focus()}>
              <span className="relative top-2 ml-4">
                Available: {maxAmount?.toFixed(2) || 0}
              </span>
            </div>
          </div>
          <div className="flex flex-row gap-3">
            {maxAmount && <button className="text-info text-sm underline underline-offset-2" onClick={() => setInput(maxAmount?.toString())}>MAX</button>}
            {selectedToken && isDepositView && <button className="btn btn-primary btn-sm" onClick={() => (document.getElementById('buy_modal') as HTMLDialogElement).showModal()}>BUY</button>}
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center gap-5">
        <button
          className={cn("btn", {
            "btn-success hover:bg-success/90": isDepositView,
            "btn-error": !isDepositView,
            "cursor-not-allowed": !selectedToken || !input || isProcessing
          }
          )}
          onClick={() => {
            if (!selectedToken || !input || isProcessing) return;
            if (isDepositView) {
              if (approvedToDeposit) {
                runDeposit();
              } else {
                handleApprove(selectedToken as Token)
              }
            } else {
              handleWithdraw(selectedToken as DepositedToken)
            }
          }}
        >
          {(isProcessing || isLoading) &&
            <span className="loading loading-spinner" />
          }
          {isDepositView ? (
            approvedToDeposit ? (isDepositConfirming ? "Depositing your tokens" : "Deposit") :
              (isPending ? "Approving your deposit" : "Approve")
          ) : (
            isProcessing ? "Withdrawing your tokens" : "Withdraw"
          )}
        </button>
        <button
          className="btn btn-ghost"
          onClick={closeWalletView}
        >
          Cancel
        </button>
      </div>
      <dialog id="buy_modal" className="modal">
        <div className="modal-box bg-background flex flex-col items-center gap-5">
          <SwapToken
            closeModal={closeModal}
            tokens={tokens as Token[]}
            selectedToken={selectedToken as Token}
            setSelectedToken={setSelectedToken}
            tokenboundAccount={tokenboundAccount}
          />
          <button
            onClick={() => closeModal()}
            className="btn btn-sm btn-circle btn-ghost absolute right-[0.7px] top-[0.7px]"
          >
            ✕
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button id="close-buy-modal">close</button>
        </form>
      </dialog>
    </div >
  )
}