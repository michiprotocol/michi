import { Wallet } from "@/constants/types/wallet"

export default function WalletItem({ wallet }: {
  wallet: Wallet
}) {

  return (
    <div className="bg-dark text-info">
      {wallet.backpack}
    </div>
  )
}