export interface Wallet {
  id: string;
  name: string;
  address: string;
  balance: number;
  points: number;
  tokens: unknown[];
}