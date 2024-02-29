import { michiBackpackOriginAddress, michiOriginABI } from "@/constants/contracts/MichiBackpack";
import { Wallet } from "@/constants/types/wallet";
import { defaultChain } from "@/wagmi";
import { Address } from "viem"
import { useAccount, useContractWrite } from "wagmi";

export default function TransferWaller({
  tokenboundAccount,
  closeWalletView,
  walletTokenId
}: {
  tokenboundAccount: Address;
  closeWalletView: () => void;
  walletTokenId: Wallet["tokenId"];
}) {
  const { writeContractAsync } = useContractWrite();
  const { address } = useAccount();
  // const [value, setValue] = use

  const handleTransfer = async (transferTo: Address) => {
    await writeContractAsync({
      account: address,
      abi: michiOriginABI!,
      chainId: defaultChain.id,
      address: michiBackpackOriginAddress,
      functionName: 'transferFrom',
      args: [
        address,
        transferTo,
        walletTokenId
      ],
    })
  }

  michiBackpackOriginAddress
  return (
    <div className="flex flex-col w-full">
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
      <button className="btn btn-sm" onClick={() => handleTransfer(value)}></button>
    </div>
  )
}