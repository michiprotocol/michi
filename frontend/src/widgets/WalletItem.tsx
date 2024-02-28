import useTokenboundClient from "@/app/hooks/useTokenboundClient";
import { abi, michiBackpackAddress } from "@/constants/contracts/MichiBackpack";
import { DepositedToken, Token } from "@/constants/types/token";
import { Wallet } from "@/constants/types/wallet";
import TokensTable from "@/shared/TokensTable";
import WalletWrapper from "@/shared/WalletWrapper";
import { defaultChain, wagmiConfig } from "@/wagmi";
import axios from "axios";
import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import { Address } from "viem";
import { useAccount, useReadContract } from 'wagmi';
import WalletViewComponent from "@/features/WalletView";
import { cn } from "@/lib/utils";

export enum WalletView {
  DEPOSIT,
  WITHDRAW,
  NONE,
}

export default function WalletItem({ wallet, index }: { wallet: Wallet, index: number }) {
  const { tokenboundClient } = useTokenboundClient()
  const account = useAccount()
  const [view, setView] = useState<WalletView>(WalletView.NONE)
  const [tokens, setTokens] = useState<Token[]>([])
  const [depositedTokens, setDepositedTokens] = useState<DepositedToken[]>([])

  const tokenboundAccount = tokenboundClient.getAccount({
    tokenContract: michiBackpackAddress,
    tokenId: wallet.tokenId,
  })

  const canDeposit = useMemo(() => {
    return tokens.length > 0;
  }, [tokens.length])

  const canWithdraw = useMemo(() => {
    return depositedTokens.length > 0;
  }, [depositedTokens.length])

  const approvedTokens: { data: Token["token_address"][] | undefined } = useReadContract({
    abi,
    config: wagmiConfig,
    chainId: defaultChain.id,
    address: michiBackpackAddress,
    functionName: "getApprovedTokens",
  })

  useEffect(() => {
    const fetchTokenBalances = async (acc: Address, isDeposited?: boolean) => {
      try {
        axios.post('http://localhost:3000/token-balances', {
          tokenboundAccount: acc,
          chain: defaultChain.id
        }).then(({ data }: { data: Token[] }) => {
          console.log("🚀 ~ fetchTokenBalances ~ data:", data)
          const newPoints = data.filter(token => {
            return approvedTokens.data!.some(approvedToken => approvedToken.toLowerCase() === token.token_address);
          });

          if (isDeposited) {
            // TYLER-TODO:
            // make a request to your scraper to get the data about points
            // You can look at Token interface to see what data it requires
            setDepositedTokens(newPoints as DepositedToken[])
          } else {
            setTokens(newPoints)
          }
        });

      } catch (e) {
        console.error(e);
      }
    }

    if (approvedTokens.data) {
      if (account.address) {
        fetchTokenBalances(account.address);
      }
      if (tokenboundAccount) {
        fetchTokenBalances(tokenboundAccount);
      }
    }
  }, [tokenboundAccount, approvedTokens.data])

  return (
    <WalletWrapper address={tokenboundAccount} name="MichiBackpack" index={index}>
      <>
        <div className={
          cn(
            "flex flex-row justify-center bg-transparent text-secondary w-full rounded-lg",
            { "p-3": view === WalletView.NONE }
          )}
        >
          {canWithdraw ? (
            <TokensTable tokens={depositedTokens} />
          ) : view === WalletView.NONE ? (
            <span className="text-center">No assets deposited.</span>
          ) : (
            <WalletViewComponent view={view} setView={setView} tokens={tokens} depositedTokens={depositedTokens} setDepositedTokens={setDepositedTokens} />
          )
          }
        </div>
        {WalletView.NONE === view && (
          <div className="flex flex-row justify-center gap-5 mt-1">
            <button
              className="btn btn-md"
              onClick={() => setView(WalletView.DEPOSIT)}
            >
              Deposit
            </button>
            {canWithdraw && (
              <button
                className="btn btn-md"
                onClick={() => setView(WalletView.WITHDRAW)}
              >
                Withdraw
              </button>
            )}
          </div>
        )}
      </>
    </WalletWrapper >
  )
}