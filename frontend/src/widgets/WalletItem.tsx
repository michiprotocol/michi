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

export default function WalletItem({ wallet, index }: { wallet: Wallet, index: number }) {
  const { tokenboundClient } = useTokenboundClient()
  const account = useAccount()
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
        <div className={classNames(
          "flex flex-row justify-center text-secondary w-full rounded-lg p-3",
          {
            "bg-placeholder-background": !canDeposit,
            "bg-transparent": canDeposit,
          }
        )}>
          {canWithdraw ? (
            <TokensTable tokens={depositedTokens} />
          ) : canDeposit ? (
            // <TokensTable tokens={tokens} />
            <div>
              Deposit here
            </div>
          ) : (
            <span className="text-center">No assets deposited.</span>
          )}
        </div>
        <div className="flex flex-row justify-center gap-5 mt-1">
          <button className="btn btn-md">Deposit</button>
          {canWithdraw && (<button className="btn btn-md">Withdraw</button>)}
        </div>
      </>
    </WalletWrapper>
  )
}