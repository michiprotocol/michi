import { Wallet } from "@/constants/types/wallet";
import CreateNewWallet from "@/features/CreateNewWallet";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function MyWallets() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const account = useAccount()

  const addWallet = (wallet: Wallet) => {
    setWallets([...wallets, wallet])
  }

  return (
    <div className="min-h-screen px-20 py-10">
      <div className="flex flex-row justify-between">
        <h3 className="font-bold text-3xl">My Wallets</h3>
        {account && <CreateNewWallet addWallet={addWallet} />}
      </div>
      <div className="flex flex-col mt-10">
        <div className="border-b-[1px] pb-2 flex flex-row justify-center">
          <span className="text-center w-2/3">Michi wallets are represented as NFTs. Deposit supported tokens into these wallets to earn points.</span>
        </div>
      </div>
    </div>
  )
}