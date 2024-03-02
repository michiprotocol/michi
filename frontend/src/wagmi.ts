import {
  getDefaultConfig
} from "connectkit";
import { createConfig } from "wagmi";
import { arbitrum } from 'wagmi/chains';

export const defaultChain = arbitrum;
export const ACCOUNT_IMPLEMENTATION = "0xfD37Fb5878Ba778519fdDdD2655f8eDa05483a15";

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