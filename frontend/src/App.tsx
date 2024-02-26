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
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            margin: '32px 0 0',
            maxWidth: '320px',
          }}
        >
          {address}
        </div>
      )}
    </>
  )
}
