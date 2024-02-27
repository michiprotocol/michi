import { abi, michiBackpackAddress } from "@/constants/contracts/MichiBackpack";
import { BackpackCreatedLog } from "@/constants/types/BackpackCreatedLog";
import { Wallet } from "@/constants/types/wallet";
import CreateNewWallet from "@/features/CreateNewWallet";
import WalletItem from "@/shared/WalletItem";
import { defaultChain, wagmiConfig } from "@/wagmi";
import { useState } from "react";
import { Address } from "viem";
import { useAccount, useReadContract, useWatchContractEvent } from 'wagmi';

export default function MyWallets() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const account = useAccount()

  const result = useReadContract({
    abi,
    config: wagmiConfig,
    chainId: defaultChain.id,
    address: michiBackpackAddress,
    functionName: "owner"
  })
  console.log("🚀 ~ MyWallets ~ result:", result.data)

  useWatchContractEvent({
    config: wagmiConfig,
    chainId: defaultChain.id,
    address: michiBackpackAddress,
    eventName: 'BackpackCreated',
    abi,
    onLogs(logs) {
      setWallets([
        ...wallets,
        ...(logs.map(log => ({ backpack: ((log as unknown as BackpackCreatedLog).args?.backpack as Address) })))
      ]);
    },
  })

  const addWallet = (wallet: Wallet) => {
    setWallets([...wallets, wallet])
  }

  return (
    <div className="min-h-screen px-20 py-10">
      <div className="flex flex-row justify-between">
        <h3 className="font-bold text-3xl">My Wallets</h3>
        {account && <CreateNewWallet addWallet={addWallet} />}
      </div>
      <div className="flex flex-col mt-10 gap-10">
        <div className="border-b-[1px] pb-2 flex flex-row justify-center">
          <span className="text-center w-2/3">Michi wallets are represented as NFTs. Deposit supported tokens into these wallets to earn points.</span>
        </div>
        <div className="flex flex-col">
          {wallets.map(wallet => (
            <WalletItem key={wallet.backpack} wallet={wallet} />
          ))}
        </div>
      </div>
    </div>
  )
}