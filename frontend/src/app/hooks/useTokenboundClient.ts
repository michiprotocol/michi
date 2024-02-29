import { defaultChain } from "@/wagmi";
import { TokenboundClient } from "@tokenbound/sdk";
import { WalletClient, createWalletClient } from "viem";
import { http, useAccount } from "wagmi";

export const walletClient: WalletClient = createWalletClient({
  chain: defaultChain,
  transport: http(),
})
export default function useTokenboundClient() {
  const { address } = useAccount()

  const tokenboundClient = new TokenboundClient({ walletClient: walletClient as any, chain: defaultChain as any })
  return { tokenboundClient }
}