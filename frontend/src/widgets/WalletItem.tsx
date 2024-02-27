import useTokenboundClient from "@/app/hooks/useTokenboundClient";
import { michiBackpackAddress } from "@/constants/contracts/MichiBackpack";
import { Token } from "@/constants/types/token";
import { Wallet } from "@/constants/types/wallet";
import TokensTable from "@/shared/TokensTable";
import WalletWrapper from "@/shared/WalletWrapper";
import { defaultChain } from "@/wagmi";
import axios from "axios";
import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";

export default function WalletItem({ wallet, index }: { wallet: Wallet, index: number }) {
  const { tokenboundClient } = useTokenboundClient()
  const [tokens, setTokens] = useState<Token[]>([{
    address: "0x34234",
    symbol: "YT-eETH 26 June 2024",
    amount: 28.636,
    elPoints: 1583.5,
    protocolPoints: 31934.21
  }])

  const tokenboundAccount = tokenboundClient.getAccount({
    tokenContract: michiBackpackAddress,
    tokenId: wallet.tokenId,
  })

  const hasTokens = useMemo(() => {
    return tokens.length > 0;
  }, [tokens])

  useEffect(() => {
    const fetchTokenBalances = async () => {
      try {
        axios.post('http://localhost:3000/token-balances', {
          tokenboundAccount,
          chain: defaultChain.id
        }).then(({ data }: { data: Token[] }) => {
          // fetch points data here

          setTokens(data)
        });

      } catch (e) {
        console.error(e);
      }
    }

    if (tokenboundAccount) {
      fetchTokenBalances();
    }
  }, [tokenboundAccount])

  return (
    <WalletWrapper address={tokenboundAccount} name="MichiBackpack" index={index}>
      <>
        <div className={classNames(
          "flex flex-row justify-center text-secondary w-full rounded-lg p-3",
          {
            "bg-placeholder-background": !hasTokens,
            "bg-transparent": hasTokens,
          }
        )}>
          {hasTokens ? (
            <TokensTable tokens={tokens} />
          ) : (
            <span className="text-center">No assets deposited.</span>
          )}
        </div>
        <div className="flex flex-row justify-center gap-5 mt-1">
          <button className="btn btn-md">Deposit</button>
          {hasTokens && (<button className="btn btn-md">Withdraw</button>)}
        </div>
      </>
    </WalletWrapper>
  )
}