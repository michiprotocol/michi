import { defaultChain } from "@/wagmi";
import { TokenboundClient } from "@tokenbound/sdk";
import { WalletClient, createWalletClient } from "viem";
import { http } from "wagmi";

const ACCOUNT_IMPLEMENTATION = "0xfD37Fb5878Ba778519fdDdD2655f8eDa05483a15";

export const walletClient: WalletClient = createWalletClient({
  chain: defaultChain,
  transport: http(),
})
export default function useTokenboundClient() {
  const tokenboundClient = new TokenboundClient({
    walletClient: walletClient as any,
    chain: defaultChain as any,
    implementationAddress: ACCOUNT_IMPLEMENTATION
  })
  return { tokenboundClient }
}