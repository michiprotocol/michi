import {
  getDefaultConfig
} from "connectkit";
import { createConfig } from "wagmi";
import { Chain, arbitrum } from 'wagmi/chains';

export const defaultChain = arbitrum;
const chains = [defaultChain] as [Chain];

export const wagmiConfig = createConfig(
  getDefaultConfig({
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID!,
    chains,
    appName: 'Michi',
    appDescription: 'Trade your airdrop points with ease',
    appUrl: 'https://tokenbound.org',
  })
)