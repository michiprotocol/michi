import { Token } from "@/constants/types/token";
import SwapInput from "@/shared/SwapInput";
import TokenSelect from "@/shared/TokenSelect";
import { useState } from "react";
import { Address } from "viem";

export default function SwapToken({
  closeModal,
  tokens,
  selectedToken,
  setSelectedToken,
  tokenboundAccount,
}: {
  closeModal: () => void,
  tokens: Token[],
  selectedToken: Token,
  setSelectedToken: (token: Token) => void;
  tokenboundAccount: Address,
}) {
  const [input, setInput] = useState<string>("");
  const [receiveValue, setReceiveValue] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  return (
    <div className="flex flex-col w-full h-full gap-2">
      <div className="relative flex flex-col w-full gap-1">
        <SwapInput
          label="You pay"
          placeholder="0"
          price="0.0"
          value={input}
          setValue={(value) => setInput(value)}
          available="0.0"
          reactNode={
            <div className="text-info text-xl">
              ETH
            </div>
          }
        />
        <SwapInput
          isBottom
          label="You get"
          placeholder="0"
          price="0.0"
          value={input}
          setValue={(value) => setInput(value)}
          available="0.0"
          reactNode={
            // <div className="mr-10">
            //   <TokenSelect
            //     selectedToken={selectedToken}
            //     setSelectedToken={setSelectedToken}
            //     tokens={tokens}
            //     isDisabled={isProcessing}
            //   />
            // </div>
            <div className="text-info text-xl">
              {selectedToken?.symbol}
            </div>
          }
        />
        <div id="arrow" className="absolute w-10 h-10 rounded-md p-2 bg-background top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-auto z-20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="10" height="10" fill="none" /><line x1="128" y1="40" x2="128" y2="216" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><polyline points="56 144 128 216 200 144" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>
        </div>
      </div>
      <button className="btn btn-primary">Purchase</button>
    </div>
  )
}