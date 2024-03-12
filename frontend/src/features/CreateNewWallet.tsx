import { abi, michiChestHelperAddress } from "@/constants/contracts/MichiChest";
import { Wallet } from "@/constants/types/wallet";
import { defaultChain } from "@/wagmi";
import { useEffect } from "react";
import { useToast } from "@/shared/ui/use-toast";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { decodeEthereumLog, numOfConfirmationsToWaitFor } from "@/lib/utils";

export default function CreateNewWallet({
  addWallet
}: {
  addWallet: (wallet: Wallet) => void
}) {
  const { toast } = useToast()
  const { writeContractAsync, isPending, data: hash } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed, data } =
  useWaitForTransactionReceipt({
    hash,
    confirmations: numOfConfirmationsToWaitFor,
  })
  const account = useAccount();
  const isLoading = isPending || isConfirming;

  useEffect(() => {
    if (isConfirmed) {
      const chestCreatedLogData = data.logs[data.logs.length - 1].data;
      const logInfo = decodeEthereumLog(chestCreatedLogData);

      addWallet(
        {
          tokenId: logInfo.numericValue,
          tokenAddress: logInfo.address,
        }
      );
      toast({
        title: "New Wallet Created 🎉",
        description: `Your Wallet #${logInfo.numericValue} has been created and is now visible on your dashboard.`,
      })
      closeModal();
    }

  }, [isConfirmed]);

  const createNewWallet = async () => {

    // request to create a new wallet
    await writeContractAsync({
      account: account.address,
      abi,
      chainId: defaultChain.id,
      address: michiChestHelperAddress,
      functionName: 'createWallet',
      args: [
        1,
      ],
    }).catch((e) => {
      console.error(e);

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
      <button className="btn bg-orange-200 hover:bg-orange-300" onClick={() => (document.getElementById('my_modal_1') as HTMLDialogElement).showModal()}>Create New Wallet</button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box bg-background flex flex-col items-center gap-5">
          <p className="text-lg">
            Creating a wallet involves minting a Michi NFT and registering a wallet that is owned by the NFT.  Once minted, the wallet will show up on your dashboard.
          </p>
          <button className="btn" onClick={createNewWallet}>
            {isLoading && <span className="loading loading-spinner" />}
            {isLoading ? "Creating a" : "Create"} New Wallet
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button id="close-btn">close</button>
        </form>
      </dialog>
    </>
  )
}