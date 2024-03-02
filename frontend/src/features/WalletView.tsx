import { abi, michiChestHelperAddress } from "@/constants/contracts/MichiChest"
import { tokenABIs } from "@/constants/contracts/tokenABIs"
import { DepositEventLog } from "@/constants/types/DepositEventLog"
import { DepositedToken, Token } from "@/constants/types/token"
import { cn } from "@/lib/utils"
import TokenSelect from "@/shared/TokenSelect"
import { useToast } from "@/shared/ui/use-toast"
import { defaultChain, wagmiConfig } from "@/wagmi"
import { WalletView as WalletViewType } from "@/widgets/WalletItem"
import { TokenboundClient } from "@tokenbound/sdk"
import { BigNumber, BigNumberish, ethers } from "ethers"
import { formatEther, parseEther } from "ethers/lib/utils"
import { useEffect, useMemo, useRef, useState } from "react"
import { Address } from "viem"
import { useAccount, useReadContract, useWalletClient, useWatchContractEvent, useWriteContract } from "wagmi"
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
  const inputRef = useRef<HTMLInputElement>(null);
  const isDepositView = useMemo(() => view === WalletViewType.DEPOSIT, [view]);
  const tokenABI = useMemo(() => selectedToken && tokenABIs[selectedToken.token_address], [selectedToken])
  const account = useAccount();
  const { toast } = useToast();
  const { writeContractAsync } = useWriteContract()

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
        if (balance.lt(0)) {
          balance = BigNumber.from(0);
        }
      } else {
        balance = selectedToken.balance;
      }
      return Number(Number(formatEther(balance)).toFixed(2))
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
  console.log("🚀 ~ selectedTokenAllowance:", selectedTokenAllowance)
  const approvedToDeposit = useMemo(
    () => selectedTokenAllowance && Number(formatEther(selectedTokenAllowance as BigNumberish)) >= Number(input),
    [selectedTokenAllowance, input]
  );
  console.log("🚀 ~ approvedToDeposit:", approvedToDeposit)

  // token approval event listener
  useWatchContractEvent({
    config: wagmiConfig,
    chainId: defaultChain.id,
    address: selectedToken?.token_address,
    eventName: "Approval",
    abi: tokenABI,
    onLogs() {
      refetchSelectedTokenAllowance();
    },
  })

  useWatchContractEvent({
    config: wagmiConfig,
    chainId: defaultChain.id,
    address: michiChestHelperAddress,
    abi,
    eventName: "Deposit",
    onLogs(logs) {
      console.log("🚀 ~ onLogs ~ logs:", logs)
      const depositResponse = (logs[0] as unknown as DepositEventLog).args;
      toast({
        title: "Deposited successfully! 🎉",
        description: `${formatEther(depositResponse.amountAfterFees)} of ${selectedToken?.symbol} were deposited into your account`,
      })
      fetchTokensData();
      setIsProcessing(false);
      closeWalletView();
    },
  })

  useWatchContractEvent({
    config: wagmiConfig,
    chainId: defaultChain.id,
    address: selectedToken?.token_address,
    abi: selectedToken && tokenABIs[selectedToken?.token_address],
    eventName: "Transfer",
    onLogs(logs) {
      toast({
        title: "Withdrawn successfully! 🎉",
        // @ts-ignore
        description: `${formatEther(logs[0].args.value)} of ${selectedToken?.symbol} were withdrawn from your account`,
      })
      fetchTokensData();
      setIsProcessing(false);
      closeWalletView();
    },
  })

  const handleDeposit = async (token: Token) => {
    console.log("🚀 ~ handleDeposit ~ inside handleDeposit:", handleDeposit)
    setIsProcessing(true);
    if (!approvedToDeposit) {
      console.log("🚀 ~ handleDeposit ~ approvedToDeposit before writeContract:", approvedToDeposit)
      await writeContractAsync({
        account: account.address,
        abi: tokenABI!,
        chainId: defaultChain.id,
        address: token.token_address,
        functionName: 'approve',
        args: [
          michiChestHelperAddress,
          +(maxAmount || input) * (10 ** 18)
        ],
      })
    }
  }

  useEffect(() => {
    console.log("🚀 ~ runDeposit ~ before runDeposit:")
    const runDeposit = async () => {
      console.log('async runDeposit')
      console.log("🚀 ~ runDeposit ~ account:", account)
      console.log("🚀 ~ runDeposit ~ selectedToken:", selectedToken)
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
    console.log("🚀 ~ useEffect ~ isProcessing:", isProcessing)
    if (isProcessing && approvedToDeposit && isDepositView) {
      console.log("🚀 ~ useEffect ~ runDeposit:")
      runDeposit();
    } else {
      refetchSelectedTokenAllowance();
    }
  }, [isProcessing, approvedToDeposit])


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
    const res = await walletClient.sendTransaction(execution)
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
                Available: {maxAmount || 0}
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
            "btn-error": !isDepositView
          }
          )}
          onClick={() => {
            if (!selectedToken || !input) return;
            console.log("🚀 ~ isDepositView: inside click", isDepositView)
            if (isDepositView) {
              handleDeposit(selectedToken as Token)
            } else {
              handleWithdraw(selectedToken as DepositedToken)
            }
          }}
        >
          {isProcessing &&
            <span className="loading loading-spinner" />
          }{isDepositView ? (
            isProcessing ? "Depositing your tokens" : "Deposit"
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