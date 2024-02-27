import { Address } from "viem";

export interface Wallet {
  backpack: Address;
  tokenId: string;
}