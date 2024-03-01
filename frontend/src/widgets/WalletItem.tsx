import useTokenboundClient from "@/app/hooks/useTokenboundClient";
import { abi, michiChestHelperAddress, michiChestOriginAddress } from "@/constants/contracts/MichiChest";
import { DepositedToken, Token } from "@/constants/types/token";
import { Wallet } from "@/constants/types/wallet";
import TokensTable from "@/shared/TokensTable";
import WalletWrapper from "@/shared/WalletWrapper";
import { defaultChain, wagmiConfig } from "@/wagmi";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Address } from "viem";
import { useAccount, useReadContract } from 'wagmi';
import WalletViewComponent from "@/features/WalletView";
import { cn } from "@/lib/utils";
import TransferWallet from "@/features/TransferWallet";

interface PointData {
  elPoints: number;
  points: number;
}

interface ApiResponse {
  address: string;
  results: Array<{
    platform: string;
    data: PointData | { error: string; url: string };
  }>;
}

async function fetchPoints(address: string): Promise<ApiResponse> {
  try {
    const response = await axios.get<ApiResponse>(`${import.meta.env.VITE_SERVER_URL}/getPoints?address=${address}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching points:', error.message);
      throw new Error(error.message);
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
}

export enum WalletView {
  DEPOSIT,
  WITHDRAW,
  TRANSFER,
  NONE,
  // in case of adding any other views, have to edit logic of WalletView component
}

export default function WalletItem({ wallet, index, removeWallet }: { wallet: Wallet, index: number, removeWallet: (tokenId: Wallet["tokenId"]) => void }) {
  const { tokenboundClient } = useTokenboundClient()
  const account = useAccount()
  const [view, setView] = useState<WalletView>(WalletView.NONE)
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [tokens, setTokens] = useState<Token[]>([])
  const [depositedTokens, setDepositedTokens] = useState<DepositedToken[]>([])
  const closeWalletView = useCallback(() => setView(WalletView.NONE), [setView])

  const points = useMemo(() => {
    return Array(30).fill(null).map(_ => {
      return {
        elPoints: Number((Math.random() * 100000).toFixed(2)),
        protocolPoints: Number((Math.random() * 100000).toFixed(2)),
      }
    })
  }, [])

  const tokenboundAccount = tokenboundClient.getAccount({
    tokenContract: michiChestOriginAddress,
    tokenId: wallet.tokenId,
  })

  const canWithdraw = useMemo(() => {
    return depositedTokens.length > 0;
  }, [depositedTokens.length])

  const approvedTokens: { data: Token["token_address"][] | undefined } = useReadContract({
    abi,
    config: wagmiConfig,
    chainId: defaultChain.id,
    address: michiChestHelperAddress,
    functionName: "getApprovedTokens",
  })

  const fetchTokenBalances = async (acc: Address, isDeposited?: boolean) => {
    setIsFetchingData(true)
    try {
      axios.post(`${import.meta.env.VITE_SERVER_URL}/token-balances`, {
        tokenboundAccount: acc,
        chain: defaultChain.id
      }).then(({ data }: { data: Token[] }) => {
        const newTokens = data.filter(token => {
          return approvedTokens.data!.some(approvedToken => approvedToken.toLowerCase() === token.token_address);
        });

        if (isDeposited) {
          // Keep disabled until deployed to Mainnet
          const tokensWithPoints = newTokens.map((token, index) => {
            return { ...token, ...points[index] }
          })

          // fetchPoints("0x0561e5b036DdcF2401c2B6b486f85451d75760A2")
          //   .then(data => console.log(data))
          //   .catch(error => console.error(error));

          setDepositedTokens(tokensWithPoints as DepositedToken[])
        } else {
          setTokens(newTokens)
        }
        setIsFetchingData(false)
      });
    } catch (e) {
      console.error(e);
      setIsFetchingData(false)
    }
  }

  const fetchTokensData = useCallback(() => {
    if (approvedTokens.data) {
      if (account.address) {
        fetchTokenBalances(account.address);
      }
      if (tokenboundAccount) {
        fetchTokenBalances(tokenboundAccount, true);
      }
    }
  }, [approvedTokens.data, tokenboundAccount, account.address])

  useEffect(() => {
    fetchTokensData()
  }, [tokenboundAccount, approvedTokens.data])

  return (
    <WalletWrapper address={tokenboundAccount} name="Michi Chest" index={wallet.tokenId}>
      <>
        <div className={
          cn(
            "flex bg-transparent text-secondary w-full rounded-lg",
          )}
        >
          {view === WalletView.NONE ? (
            canWithdraw ?
              <TokensTable tokens={depositedTokens} isFetchingData={isFetchingData} /> :
              <div className="mx-auto">
                {isFetchingData ? (
                  <span className="loading loading-spinner" />
                ) : (
                  <span className="text-center">No assets deposited.</span>
                )
                }
              </div>
          ) : view === WalletView.TRANSFER ? (
            <TransferWallet
              closeWalletView={closeWalletView}
              walletTokenId={wallet.tokenId}
              removeWallet={() => removeWallet(wallet.tokenId)}
            />
          ) : (
            <WalletViewComponent
              tokenboundAccount={tokenboundAccount}
              view={view}
              closeWalletView={closeWalletView}
              tokens={tokens}
              depositedTokens={depositedTokens}
              fetchTokensData={fetchTokensData}
            />
          )}
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
            <button
              className="btn btn-md"
              onClick={() => setView(WalletView.TRANSFER)}
            >
              Transfer wallet
            </button>
          </div>
        )}
      </>
    </WalletWrapper >
  )
}