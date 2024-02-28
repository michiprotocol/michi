import { DepositedToken, Token } from "@/constants/types/token"
import { WalletView as WalletViewType } from "@/widgets/WalletItem"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { cn } from "@/lib/utils"
import { useMemo, useState } from "react"
import { formatEther, formatUnits } from "ethers/lib/utils"

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

  return (
    <div className="flex flex-col gap-5 text-info w-full">
      <div className="bg-transparent rounded-xl pb-10 p-3">
        {view === WalletViewType.DEPOSIT ? (
          <div className="flex flex-row items-center gap-1">
            <Select onValueChange={(e) => {
              setSelectedToken(tokens.find(token => token.token_address === e))
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
              {maxAmount &&
                <div className="absolute bottom-0 text-info/50 text-xs">
                  <span className="relative top-2 ml-4">
                    Available: {maxAmount}
                  </span>
                </div>
              }
            </div>
            {maxAmount && <button className="btn btn-sm" onClick={() => setInput(maxAmount?.toString())}>MAX</button>}
            {selectedToken && <button className="btn bg-action hover:bg-action/90 btn-sm">BUY</button>}
          </div>
        ) : (
          "Withdrawing tokens from wallet."
        )}
      </div>
      <div className="flex flex-row justify-center gap-5">
        <button
          className={cn("btn btn-secondary", { "btn-accent": view === WalletViewType.WITHDRAW })}
          onClick={() => {
            if (view === WalletViewType.DEPOSIT) {
              handleDeposit(tokens[0])
            } else {
              handleWithdraw(depositedTokens[0])
            }
          }}
        >
          {view === WalletViewType.DEPOSIT ? "Deposit" : "Withdraw"}
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => setView(WalletViewType.NONE)}
        >
          Cancel
        </button>
      </div>
    </div >
  )
}