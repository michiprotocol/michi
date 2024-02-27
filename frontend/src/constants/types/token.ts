import { Address } from "viem";

export interface Token {
  address: Address;
  symbol: string;
  amount: number;
  elPoints: number;
  protocolPoints: number;
}