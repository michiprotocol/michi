import { michiBackpackOriginAddress, michiOriginABI } from "@/constants/contracts/MichiBackpack";
import { Wallet } from "@/constants/types/wallet";
import { toast } from "@/shared/ui/use-toast";
import { defaultChain, wagmiConfig } from "@/wagmi";
import { useState } from "react";
import { Address } from "viem";
import { useAccount, useWatchContractEvent, useWriteContract } from "wagmi";

export default function TransferWaller({
  closeWalletView,
  walletTokenId,
  removeWallet
}: {
  closeWalletView: () => void;
  walletTokenId: Wallet["tokenId"];
  removeWallet: () => void
}) {
  const { writeContractAsync } = useWriteContract()
  const { address } = useAccount();
  const [value, setValue] = useState<string>("");
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)

  useWatchContractEvent({
    config: wagmiConfig,
    chainId: defaultChain.id,
    address: michiBackpackOriginAddress,
    abi: michiOriginABI,
    eventName: "Transfer",
    onLogs() {
      removeWallet()
      toast({
        title: "Transfer is complete successfully!"
      })
    },
  })

  const closeModal = () => {
    (document.getElementById('transfer-modal-close-btn') as HTMLDialogElement).click();
  }

  const sendInvalidAddressToast = () => {
    toast({
      title: "Error occured!",
      description: 'Address is invalid',
      variant: "destructive"
    })
  }

  const handleTransfer = async (transferTo: Address) => {
    setIsButtonLoading(true)
    try {
      await writeContractAsync({
        account: address,
        abi: michiOriginABI,
        chainId: defaultChain.id,
        address: michiBackpackOriginAddress,
        functionName: 'transferFrom',
        args: [
          address,
          transferTo,
          walletTokenId
        ],
      })
    } catch (err) {
      setIsButtonLoading(false)
      closeModal()
      if (JSON.stringify(err).includes("InvalidAddressError")) {
        sendInvalidAddressToast()
      }
    }
  }

  michiBackpackOriginAddress
  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="flex flex-col items-center w-2/3 gap-2">
        <span className="text-info">Enter recipient wallet address</span>
        <input
          type="text"
          className="input input-bordered	bg-background rounded-md border-2 !outline-none w-full text-center text-white"
          placeholder="0x0cD5....4091"
          value={value}
          onChange={(e) => setValue(e.target.value)} />
      </div>
      <div className="flex flex-row justify-center gap-5">
        <button className="btn btn-md btn-accent" onClick={() => {
          const isValidAddress = /^0x[a-fA-F0-9]/i.test(value);
          if (isValidAddress) {
            (document.getElementById('transfer_wallet_modal') as HTMLDialogElement).showModal()
          } else {
            sendInvalidAddressToast()
          }
        }}>
          Transfer Wallet
        </button>
        <button
          className="btn btn-ghost"
          onClick={closeWalletView}
        >
          Cancel
        </button>
      </div>
      <dialog id="transfer_wallet_modal" className="modal">
        <div className="modal-box bg-background flex flex-col items-center gap-5">
          <p className="text-lg">
            Transferring your wallet will transfer custody of all assets in the wallet and all points accrued to this wallet
          </p>
          <button className="btn" onClick={() => handleTransfer(value as Address)}>
            {isButtonLoading && <span className="loading loading-spinner" />}
            {isButtonLoading ? "Transferring the" : "Transfer"} Wallet
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button id="transfer-modal-close-btn">close</button>
        </form>
      </dialog>
    </div>
  )
}