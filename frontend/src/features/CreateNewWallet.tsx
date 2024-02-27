import { abi, michiBackpackAddress } from "@/constants/contracts/MichiBackpack";
import { Wallet } from "@/constants/types/wallet";
import { defaultChain } from "@/wagmi";
import { useState } from "react";
import { useAccount, useWriteContract } from 'wagmi'

export default function CreateNewWallet({
  addWallet
}: {
  addWallet: (wallet: Wallet) => void
}) {
  const { writeContractAsync } = useWriteContract()
  const account = useAccount();

  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const createNewWallet = async () => {
    setIsButtonLoading(true);

    // request to create a new wallet
    const result = await writeContractAsync({
      account: account.address,
      abi,
      chainId: defaultChain.id,
      address: michiBackpackAddress,
      functionName: 'createBackpack',
      args: [
        1,
      ],
    })
    console.log("🚀 ~ createNewWal ~ result:", result)

    // new wallet object response
    // const wallet = {}

    setIsButtonLoading(false);
    // addWallet(wallet as Wallet)
    closeModal();
  }


  const closeModal = () => {
    (document.getElementById('close-btn') as HTMLDialogElement).click();
  }
  return (
    <>
      <button className="btn btn-primary" onClick={() => (document.getElementById('my_modal_1') as HTMLDialogElement).showModal()}>Create New Wallet</button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box bg-background flex flex-col items-center gap-5">
          <p className="text-lg">
            Creating a wallet involves minting a Michi NFT and registering a wallet that is owned by the NFT.  Once minted, the wallet will show up on your dashboard.
          </p>
          <button className="btn" onClick={createNewWallet}>
            {isButtonLoading && <span className="loading loading-spinner" />}
            Create New Wallet
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button id="close-btn">close</button>
        </form>
      </dialog>
    </>
  )
}