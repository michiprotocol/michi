import {
  getDefaultConfig
} from "connectkit";
import { createConfig } from "wagmi";
import { arbitrum, sepolia } from 'wagmi/chains';

export const defaultChain = sepolia;

const chains = [defaultChain]

export const wagmiConfig = createConfig(
  getDefaultConfig({
    walletConnectProjectId: import.meta.env.WALLETCONNECT_PROJECT_ID!,
    // @ts-ignore
    chains,
    appName: 'Vite Tokenbound SDK Example',
    appDescription: 'Tokenbound SDK Example',
    appUrl: 'https://tokenbound.org',
  })
)