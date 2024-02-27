import { Address } from "viem";

export function formatCryptoAddress(address: Address | undefined) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}