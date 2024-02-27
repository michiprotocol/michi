import useTokenboundClient from "@/app/hooks/useTokenboundClient";
import { michiBackpackAddress } from "@/constants/contracts/MichiBackpack";
import { Wallet } from "@/constants/types/wallet";
import WalletWrapper from "@/shared/WalletWrapper";

export default function WalletItem({ wallet, index }: { wallet: Wallet, index: number }) {
  const { tokenboundClient } = useTokenboundClient()

  const tokenboundAccount = tokenboundClient.getAccount({
    tokenContract: michiBackpackAddress,
    tokenId: wallet.tokenId,
  })

  return (
    <WalletWrapper address={tokenboundAccount} name="MichiBackpack" index={index}>
      <>
        <div className="bg-white text-black w-full rounded-lg p-3">
          Inner data
        </div>
        <div className="flex flex-row justify-center gap-5 mt-1">
          <button className="btn btn-md">Deposit</button>
          {true && (<button className="btn btn-md">Withdraw</button>)}
        </div>
      </>
    </WalletWrapper>
  )
}