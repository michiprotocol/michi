import { michiChestOriginAddress } from "@/constants/contracts/MichiChest";
import { Wallet } from "@/constants/types/wallet";
import CreateNewWallet from "@/features/CreateNewWallet";
import { defaultChain } from "@/wagmi";
import WalletItem from "@/widgets/WalletItem";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAccount } from 'wagmi';

export default function MyWallets() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const account = useAccount()


  // listen for transfer event

  useEffect(() => {
    const fetchUserNFTs = async () => {
      try {
        axios.post(`${import.meta.env.VITE_SERVER_URL}/user-nfts`, {
          address: account.address,
          chain: defaultChain.id
        }).then(({ data }: { data: Wallet[] }) => {
          const wallets = data.filter(wallet => wallet.tokenAddress === michiChestOriginAddress.toLowerCase());
          if (["0xe57f2acb1f560c244a110a6f07f3665ab24d398d", "0x762778fd9ff6c1f78170789c69b7ae060898fae7"].includes(account.address!.toLowerCase())) {
            wallets.push({
              tokenId: "0",
              tokenAddress: michiChestOriginAddress,
            })
          }
          setWallets(wallets)
        });

      } catch (e) {
        console.error(e);
      }
      setIsLoading(false)
    }

    if (account.address && wallets.length < 1 && isLoading) {
      fetchUserNFTs();
    }
  }, [account.address])

  const addWallet = (wallet: Wallet) => {
    if (wallet.tokenId !== wallets[wallets.length - 1].tokenId) {
      const newWallets = ([...wallets, wallet])
      setWallets(newWallets)
      return newWallets.length;
    }
  }

  const removeWallet = (tokenId: Wallet["tokenId"]) => {
    setWallets(wallets.filter(wallet => wallet.tokenId !== tokenId))
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
          {isLoading && wallets.length < 1 ? (
            Array(4).fill(null).map((_, index) => (
              <div key={index} className="skeleton bg-dark w-full h-36 opacity-80" />
            ))
          ) :
            wallets.length > 0 ? wallets.map((wallet, index) => (
              <WalletItem removeWallet={removeWallet} key={index} wallet={wallet} index={index + 1} />
            )) : <div className="mx-auto text-xl">
              No wallets
            </div>
          }
        </div>
      </div>
    </div>
  )
}