import { michiBackpackOriginAddress } from "@/constants/contracts/MichiBackpack";
import { Wallet } from "@/constants/types/wallet";
import CreateNewWallet from "@/features/CreateNewWallet";
import { defaultChain } from "@/wagmi";
import WalletItem from "@/widgets/WalletItem";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAccount } from 'wagmi';

export default function MyWallets() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const account = useAccount()

  useEffect(() => {
    const fetchUserNFTs = async () => {
      try {
        axios.post('http://localhost:3000/user-nfts', {
          address: account.address,
          chain: defaultChain.id
        }).then(({ data }: { data: Wallet[] }) => {
          const wallets = data.filter(wallet => wallet.tokenAddress === michiBackpackOriginAddress.toLowerCase());
          setWallets(wallets)
        });

      } catch (e) {
        console.error(e);
      }
    }

    if (account.address && wallets.length < 1) {
      fetchUserNFTs();
    }
  }, [account.address])

  const addWallet = (wallet: Wallet) => {
    if (wallet.tokenId !== wallets[wallets.length - 1].tokenId) {
      const newWallets = ([...wallets, wallet])
      setWallets(newWallets)
      return newWallets.length - 1;
    }
  }

  if (!account.isConnected) {
    return null;
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
        <div className="flex flex-col gap-5">
          {wallets.map((wallet, index) => (
            <WalletItem key={index} wallet={wallet} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}