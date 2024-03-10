import { abi, michiChestHelperAddress } from "@/constants/contracts/MichiChest";
import { ChestCreatedLog } from "@/constants/types/ChestCreatedLog";
import { Wallet } from "@/constants/types/wallet";
import { defaultChain, wagmiConfig } from "@/wagmi";
import { useState } from "react";
import { useToast } from "@/shared/ui/use-toast"
import { useAccount, useWatchContractEvent, useWriteContract } from 'wagmi'

export default function CreateNewWallet({
  addWallet
}: {
  addWallet: (wallet: Wallet) => void
}) {
  const { toast } = useToast()
  const { writeContractAsync } = useWriteContract()
  const account = useAccount();

  const [isButtonLoading, setIsButtonLoading] = useState(false);

  useWatchContractEvent({
    config: wagmiConfig,
    chainId: defaultChain.id,
    address: michiChestHelperAddress,
    eventName: 'ChestCreated',
    abi,
    onLogs(logs) {
      const wallet = (logs[0] as unknown as ChestCreatedLog).args;
      addWallet(
        {
          tokenId: wallet.tokenId,
          tokenAddress: wallet.nftContract,
        }
      );
      toast({
        title: "New Wallet Created 🎉",
        description: `Your Wallet #${wallet.tokenId} has been created and is now visible on your dashboard.`,
      })
      closeModal();
      setIsButtonLoading(false);
    },
  })

  const createNewWallet = async () => {
    setIsButtonLoading(true);

    // request to create a new wallet
    await writeContractAsync({
      account: account.address,
      abi,
      chainId: defaultChain.id,
      address: michiChestHelperAddress,
      functionName: 'createChest',
      args: [
        1,
      ],
    }).catch((e) => {
      console.error(e);
      setIsButtonLoading(false);

      // 4001 means user rejected the transaction
      if (e.cause?.code !== 4001) {
        toast({
          title: "Error",
          description: e.message,
        })
      }

      closeModal();
    });
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
            {isButtonLoading ? "Creating a" : "Create"} New Wallet
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button id="close-btn">close</button>
        </form>
      </dialog>
    </>
  )
}