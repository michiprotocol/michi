import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'


export function App() {
  const { isConnected, address } = useAccount()

  return (
    <>
      <h1>Michi</h1>
      <ConnectKitButton theme="midnight" />
      {address && (
        <div
          className="text-xl text-red-500"
        >
          {address}
        </div>
      )}
    </>
  )
}
