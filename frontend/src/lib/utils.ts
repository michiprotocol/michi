import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Address } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function decodeEthereumLog(data: string) {
  // Remove the '0x' prefix
  const hexData = data.startsWith('0x') ? data.substring(2) : data;

  // Extract the address (next 40 characters after the initial 24 characters for padding)
  const address = '0x' + hexData.substring(24, 64);

  // Extract the numeric value (remaining part of the string)
  const numericValueHex = '0x' + hexData.substring(64);
  const numericValue = BigInt(numericValueHex);

  return {
    address: address as Address,
    numericValue: numericValue.toString()
  };
}
