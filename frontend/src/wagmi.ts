import {
  getDefaultConfig
} from "connectkit";
import { createConfig } from "wagmi";
import { Chain, arbitrum, sepolia } from 'wagmi/chains';

export const defaultChain = sepolia;
const chains = [defaultChain] as [Chain];

export const wagmiConfig = createConfig(
  getDefaultConfig({
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID!,
    chains,
    appName: 'Vite Tokenbound SDK Example',
    appDescription: 'Tokenbound SDK Example',
    appUrl: 'https://tokenbound.org',
  })
)