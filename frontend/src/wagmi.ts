import {
  getDefaultConfig
} from "connectkit";
import { createConfig } from "wagmi";
import { arbitrum } from 'wagmi/chains';

export const defaultChain = arbitrum;

const chains = [defaultChain]

export const wagmiConfig = createConfig(
  getDefaultConfig({
    walletConnectProjectId: import.meta.env.WALLETCONNECT_PROJECT_ID!,
    // @ts-ignore
    chains,
    appName: 'Michi',
    appDescription: 'Trade your airdrop points with ease',
    appUrl: 'https://tokenbound.org',
  })
)