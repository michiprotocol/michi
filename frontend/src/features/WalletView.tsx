import { DepositedToken, Token } from "@/constants/types/token"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { WalletView as WalletViewType } from "@/widgets/WalletItem"
import { formatEther } from "ethers/lib/utils"
import { useMemo, useState } from "react"

export default function WalletView({
  view,
  setView,
  tokens,
  depositedTokens,
  setDepositedTokens
}: {
  view: WalletViewType,
  setView: (view: WalletViewType) => void,
  tokens: Token[],
  depositedTokens: DepositedToken[],
  setDepositedTokens: (tokens: DepositedToken[]) => void
}) {
  const [selectedToken, setSelectedToken] = useState<Token | DepositedToken | undefined>(undefined);
  const isDepositView = useMemo(() => view === WalletViewType.DEPOSIT, [view]);

  console.log("🚀 ~ selectedToken:", selectedToken)
  const [input, setInput] = useState<string>("");
  const maxAmount = useMemo(() => {
    if (selectedToken?.balance) {
      return Number(Number(formatEther(selectedToken.balance)).toFixed(2))
    }
  }, [selectedToken?.balance]);

  const handleDeposit = (token: Token) => {

  }

  const handleWithdraw = (token: DepositedToken) => {

  }

  const closeModal = () => {
    (document.getElementById('close-buy-modal') as HTMLDialogElement).click();
  }

  return (
    <div className="flex flex-col gap-5 text-info w-full">
      <div className="bg-transparent rounded-xl p-2">
        <div className="flex flex-row items-center gap-1">
          <Select onValueChange={(value) => {
            setSelectedToken(tokens.find(token => token.token_address === value))
            if (selectedToken?.token_address !== value) {
              setInput('')
            }
          }}>
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
          className={cn("btn btn-success hover:bg-success/90", { "btn-error": !isDepositView })}
          onClick={() => {
            if (isDepositView) {
              handleDeposit(selectedToken as Token)
            } else {
              handleWithdraw(selectedToken as DepositedToken)
            }
          }}
        >
          {isDepositView ? "Deposit" : "Withdraw"}
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