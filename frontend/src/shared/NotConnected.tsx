import { ConnectKitButton } from "connectkit";

export default function NotConnected() {

  return (
    <div className="h-[100vh] flex flex-col items-center justify-start gap-5 pt-12">
      <span className="text-xl">
        Please connect your wallet to continue
      </span>
      <ConnectKitButton />
    </div>
  )
}