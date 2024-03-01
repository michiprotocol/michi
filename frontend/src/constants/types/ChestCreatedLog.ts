import { Address } from "viem"

export interface ChestCreatedLog {
  args: {
    chest: Address;
    sender: Address;
    nftContract: Address;
    tokenId: string;
  }
}