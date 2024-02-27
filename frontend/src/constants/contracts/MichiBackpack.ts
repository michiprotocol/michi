import { Address } from "viem";

export const abi = [
  {
    "type": "function",
    "name": "createBackpack",
    "inputs": [
      {
        "name": "quantity",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  }
];

export const michiBackpackAddress: Address = "0xE15c65F038782314C803B94f0813Abc853feC2B0";