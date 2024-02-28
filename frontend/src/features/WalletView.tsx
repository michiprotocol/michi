import { DepositedToken, Token } from "@/constants/types/token"
import { WalletView as WalletViewType } from "@/widgets/WalletItem"

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

  const handleDeposit = (token: Token) => {

  }

  const handleWithdraw = (token: DepositedToken) => {

  }

  return (
    <div className="flex flex-col gap-5 text-info w-full">
      <div className="bg-secondary-background min-h-[200px] p-3">
        {view === WalletViewType.DEPOSIT ? (
          "Depositing tokens into wallet."
        ) : (
          "Withdrawing tokens from wallet."
        )}
      </div>
      <div className="flex flex-row justify-center gap-5">
        <button
          className="btn btn-md"
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