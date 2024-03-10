export interface TransferLog {
  args: {
    from: string;
    to: string;
    value: BigInt;
  }
}