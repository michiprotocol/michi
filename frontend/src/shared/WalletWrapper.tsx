import { ReactNode } from "react"
import { Address } from "viem"
import { formatCryptoAddress } from "./helpers/formatCryptoAddress"
import { defaultChain } from "@/wagmi"

export default function WalletWrapper({ address, name, index, children }: {
  address: Address,
  name: string,
  index: string,
  children: ReactNode
}) {

  return (
    <div key={index} className="bg-dark rounded-md px-5 py-3 flex flex-col gap-3 text-info">
      <div className="flex flex-row justify-between font-normal">
        <span>{name} #{index}</span>
        <div className="flex flex-row items-center gap-2">
          <span className="whitespace-nowrap">Linked Wallet:</span>
          <a href={`${defaultChain.blockExplorers.default.url}/address/${address}`}>{formatCryptoAddress(address)}</a>
        </div>
      </div>
      {children}
    </div>
  )
}