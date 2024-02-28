import { ReactNode } from "react"
import { Address } from "viem"
import { formatCryptoAddress } from "./helpers/formatCryptoAddress"

export default function WalletWrapper({ address, name, index, children }: {
  address: Address,
  name?: string,
  index: number,
  children: ReactNode
}) {

  return (
    <div key={index} className="bg-dark rounded-md px-5 py-3 flex flex-col gap-3 text-info">
      <div className="flex flex-row justify-between font-normal">
        <span>Wallet NFT #{index}</span>
        <div className="flex flex-row items-center gap-2">
          <span className="whitespace-nowrap">Linked Wallet:</span>
          <span>{formatCryptoAddress(address)}</span>
        </div>
      </div>
      {children}
    </div>
  )
}