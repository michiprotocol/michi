import { DepositedToken } from "@/constants/types/token";
import { formatEther } from "ethers/lib/utils"

export default function TokensTable({
  tokens,
  isFetchingData
}: {
  tokens: DepositedToken[]
  isFetchingData: boolean
}) {

  return (
    <div className="overflow-x-auto w-full">
      <table className="table text-info">
        <thead>
          <tr className="text-info">
            <th>Token</th>
            <th>Amount</th>
            <th>EL Points</th>
            <th>Protocol Points</th>
          </tr>
        </thead>
        <tbody>
          {
            tokens.map((token, index) => {
              const {
                symbol: name,
                balance: amount,
                elPoints,
                protocolPoints
              } = token;
              return (
                <tr key={index}>
                  <th>{name}</th>
                  <td className="flex flex-row items-center gap-2">{formatEther(amount)} {isFetchingData && <span className="loading loading-spinner" />}</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}