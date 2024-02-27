import { defaultChain } from "@/wagmi";
import { TokenboundClient } from "@tokenbound/sdk";
import { WalletClient, createWalletClient, http } from "viem";
import { useAccount } from "wagmi";

export default function useTokenboundClient() {
  const { address } = useAccount()
  const walletClient: WalletClient = createWalletClient({
    chain: defaultChain,
    account: address,
    transport: http(),
  })

  const tokenboundClient = new TokenboundClient({ walletClient: walletClient as any, chain: defaultChain as any })
  return { tokenboundClient }
}