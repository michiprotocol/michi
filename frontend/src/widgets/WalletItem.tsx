import useTokenboundClient from "@/app/hooks/useTokenboundClient";
import { abi, michiBackpackHelperAddress, michiBackpackOriginAddress } from "@/constants/contracts/MichiBackpack";
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
    const response = await axios.get<ApiResponse>(`http://localhost:3000/getPoints?address=${address}`);
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

export default function WalletItem({ wallet, index }: { wallet: Wallet, index: number }) {
  const { tokenboundClient } = useTokenboundClient()
  const account = useAccount()
  const [view, setView] = useState<WalletView>(WalletView.NONE)
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [forceTokensUpdate, setForceTokensUpdate] = useState({});
  const [tokens, setTokens] = useState<Token[]>([])
  const [depositedTokens, setDepositedTokens] = useState<DepositedToken[]>([])
  const closeWalletView = useCallback(() => setView(WalletView.NONE), [setView])

  const tokenboundAccount = tokenboundClient.getAccount({
    tokenContract: michiBackpackOriginAddress,
    tokenId: wallet.tokenId,
  })

  const canWithdraw = useMemo(() => {
    return depositedTokens.length > 0;
  }, [depositedTokens.length])

  const approvedTokens: { data: Token["token_address"][] | undefined } = useReadContract({
    abi,
    config: wagmiConfig,
    chainId: defaultChain.id,
    address: michiBackpackHelperAddress,
    functionName: "getApprovedTokens",
  })

  const forceTokenDataUpdate = () => {
    setForceTokensUpdate({});
  }

  useEffect(() => {
    const fetchTokenBalances = async (acc: Address, isDeposited?: boolean) => {
      setIsFetchingData(true)
      try {
        axios.post('http://localhost:3000/token-balances', {
          tokenboundAccount: acc,
          chain: defaultChain.id
        }).then(({ data }: { data: Token[] }) => {
          const newPoints = data.filter(token => {
            return approvedTokens.data!.some(approvedToken => approvedToken.toLowerCase() === token.token_address);
          });

          if (isDeposited) {
            // Keep disabled until deployed to Mainnet

            // fetchPoints("0x0561e5b036DdcF2401c2B6b486f85451d75760A2")
            //   .then(data => console.log(data))
            //   .catch(error => console.error(error));

            setDepositedTokens(newPoints as DepositedToken[])
          } else {
            setTokens(newPoints)
          }
          setIsFetchingData(false)
        });
      } catch (e) {
        console.error(e);
        setIsFetchingData(false)
      }
    }

    if (approvedTokens.data) {
      if (account.address) {
        fetchTokenBalances(account.address);
      }
      if (tokenboundAccount) {
        fetchTokenBalances(tokenboundAccount, true);
      }
    }
  }, [tokenboundAccount, approvedTokens.data, forceTokensUpdate])

  return (
    <WalletWrapper address={tokenboundAccount} name="MichiBackpack" index={index}>
      <>
        <div className={
          cn(
            "flex bg-transparent text-secondary w-full rounded-lg",
          )}
        >
          {view === WalletView.NONE ? (
            canWithdraw ?
              <TokensTable tokens={depositedTokens} /> :
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
              tokenboundAccount={tokenboundAccount}
              closeWalletView={closeWalletView}
              walletTokenId={wallet.tokenId}
            />
          ) : (
                <WalletViewComponent
                  tokenboundAccount={tokenboundAccount}
                  view={view}
                  closeWalletView={closeWalletView}
                  tokens={tokens}
                  depositedTokens={depositedTokens}
                  forceTokenDataUpdate={forceTokenDataUpdate}
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
              Transfer
            </button>
          </div>
        )}
      </>
    </WalletWrapper >
  )
}