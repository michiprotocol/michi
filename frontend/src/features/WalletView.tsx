import { abi, michiBackpackHelperAddress } from "@/constants/contracts/MichiBackpack"
import { tokenABIs } from "@/constants/contracts/tokenABIs"
import { DepositEventLog } from "@/constants/types/DepositEventLog"
import { DepositedToken, Token } from "@/constants/types/token"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { useToast } from "@/shared/ui/use-toast"
import { defaultChain, wagmiConfig } from "@/wagmi"
import { WalletView as WalletViewType } from "@/widgets/WalletItem"
import { BigNumberish } from "ethers"
import { formatEther } from "ethers/lib/utils"
import { useEffect, useMemo, useState } from "react"
import { Address } from "viem"
import { useAccount, useReadContract, useWatchContractEvent, useWriteContract } from "wagmi"

export default function WalletView({
  view,
  setView,
  tokens,
  depositedTokens,
  tokenboundAccount
}: {
  view: WalletViewType,
  setView: (view: WalletViewType) => void,
  tokens: Token[],
  depositedTokens: DepositedToken[],
    tokenboundAccount: Address
}) {
  const [selectedToken, setSelectedToken] = useState<Token | DepositedToken | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const isDepositView = useMemo(() => view === WalletViewType.DEPOSIT, [view]);
  const tokenABI = useMemo(() => selectedToken && tokenABIs[selectedToken.token_address], [selectedToken])
  const account = useAccount();
  const { toast } = useToast();
  const { writeContractAsync } = useWriteContract()

  const [input, setInput] = useState<string>("");
  const maxAmount = useMemo(() => {
    if (selectedToken?.balance) {
      return Number(Number(formatEther(selectedToken.balance)).toFixed(2))
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
      michiBackpackHelperAddress
    ]
  })
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
    onLogs(logs) {
      console.log("🚀 ~ onLogs ~ approval logs:", logs)
    },
  })

  useWatchContractEvent({
    config: wagmiConfig,
    chainId: defaultChain.id,
    address: michiBackpackHelperAddress,
    abi,
    eventName: "Deposit",
    onLogs(logs) {
      const depositResponse = (logs[0] as unknown as DepositEventLog).args;
      console.log("🚀 ~ onLogs ~ depositResponse:", depositResponse)
      toast({
        title: "Log 🎉",
        description: `Log occured`,
      })
      closeModal();
    },
  })

  const handleDeposit = async (token: Token) => {
    if (!input) return;
    setIsProcessing(true);
    if (!approvedToDeposit) {
      await writeContractAsync({
        account: account.address,
        abi: tokenABI!,
        chainId: defaultChain.id,
        address: token.token_address,
        functionName: 'approve',
        args: [
          michiBackpackHelperAddress,
          +input * (10 ** 18)
        ],
      })
    }
  }

  useEffect(() => {
    const runDeposit = async () => {
      await writeContractAsync({
        account: account.address,
        abi,
        chainId: defaultChain.id,
        address: michiBackpackHelperAddress,
        functionName: 'depositYT',
        args: [
          selectedToken!.token_address,
          tokenboundAccount,
          +input * (10 ** 18),
          false
        ],
      })
    }
    if (isProcessing && approvedToDeposit) {
      runDeposit();
    } else {
      refetchSelectedTokenAllowance();
    }
  }, [selectedToken, isProcessing, selectedTokenAllowance])

  const handleWithdraw = (token: DepositedToken) => {

  }

  const closeModal = () => {
    (document.getElementById('close-buy-modal') as HTMLDialogElement).click();
  }

  return (
    <div className="flex flex-col gap-5 text-info w-full">
      <div className="bg-transparent rounded-xl p-2">
        <div className="flex flex-row items-center gap-1">
          <Select
            onValueChange={(value) => {
              setSelectedToken(tokens.find(token => token.token_address === value))
              if (selectedToken?.token_address !== value) {
                setInput('')
              }
            }}
            disabled={isProcessing}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent>
              {
                tokens.map((token, index) => (
                  <SelectItem
                    key={index}
                    value={token.token_address}
                  >
                    {token.symbol}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
          <div className="flex flex-col relative">
            <input
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
            <div className="absolute bottom-0 text-info/50 text-xs">
              <span className="relative top-2 ml-4">
                Available: {maxAmount || 0}
              </span>
            </div>
          </div>
          <div className="flex flex-row gap-3">
            {maxAmount && <button className="text-info text-sm underline underline-offset-2" onClick={() => setInput(maxAmount?.toString())}>MAX</button>}
            {selectedToken && isDepositView && <button className="btn btn-sm" onClick={() => (document.getElementById('buy_modal') as HTMLDialogElement).showModal()}>BUY</button>}
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
            if (!selectedToken) return;
            if (isDepositView) {
              handleDeposit(selectedToken as Token)
            } else {
              handleWithdraw(selectedToken as DepositedToken)
            }
          }}
        >
          {isProcessing &&
            <>
              <span className="loading loading-spinner" />
              <span>Processing your </span>
            </>
          }{isDepositView ? "Deposit" : "Withdraw"}
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => setView(WalletViewType.NONE)}
        >
          Cancel
        </button>
      </div>
      <dialog id="buy_modal" className="modal">
        <div className="modal-box bg-background flex flex-col items-center gap-5">
          <p className="text-lg">
            Here you can buy more {selectedToken?.symbol}
          </p>
          <button
            onClick={() => closeModal()}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
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