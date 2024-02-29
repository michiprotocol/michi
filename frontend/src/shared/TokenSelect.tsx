import { DepositedToken, Token } from "@/constants/types/token"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"

export default function TokenSelect({ setSelectedToken, resetInput, selectedToken, tokens, isDisabled }: {
  selectedToken: Token | DepositedToken | undefined,
  tokens: (Token | DepositedToken)[],
  setSelectedToken: (token: typeof tokens[0]) => void,
  resetInput?: () => void,
  isDisabled: boolean
}) {

  return (
    <Select
      onValueChange={(value) => {
        setSelectedToken(tokens.find(token => token.token_address === value)!)
        if (selectedToken?.token_address !== value && resetInput) {
          resetInput()
        }
      }}
      disabled={isDisabled}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Select token" />
      </SelectTrigger>
      <SelectContent>
        {
          tokens.map((token, index) => (
            <SelectItem
              key={index}
              value={token.token_address}
            >
              {token.symbol}
            </SelectItem>
          ))
        }
      </SelectContent>
    </Select>
  )
}