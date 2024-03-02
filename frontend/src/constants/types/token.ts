import { Address } from "viem";

export interface Token {
  token_address: Address;
  symbol: string;
  balance: number;
  decimals: string;
}

export interface DepositedToken extends Token {
  elPoints: number;
  protocolPoints: number;
}