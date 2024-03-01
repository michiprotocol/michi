import { ConnectKitButton } from "connectkit";

export default function NotConnected() {

  return (
    <div className="h-[70vh] flex flex-col items-center justify-center gap-5">
      <span className="text-xl">
        Please connect your wallet to continue
      </span>
      <ConnectKitButton />
    </div>
  )
}