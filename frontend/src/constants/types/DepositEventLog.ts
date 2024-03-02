import { Address } from "viem"


export interface DepositEvent {
  sender: Address;
  backpack: Address;
  token: Address;
  amountAfterFees: number;
  feeTaken: number;
}

export interface DepositEventLog {
  args: DepositEvent
}