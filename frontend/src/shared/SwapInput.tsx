import { cn } from "@/lib/utils"
import { ReactNode } from "react"

export default function SwapInput({
  label,
  placeholder,
  price,
  value,
  setValue,
  available,
  reactNode,
  isBottom
}: {
  label: string,
  placeholder: string,
  price: string,
  value: string,
  setValue: (value: string) => void,
  available: string,
  reactNode: ReactNode,
  isBottom?: boolean
}) {
  return (
    <div className={cn("flex flex-row w-full h-[100px] px-5 text-label bg-dark justify-between items-center", {
      "rounded-b-md": isBottom,
      "rounded-t-md": !isBottom,
    })}>
      <div className="flex flex-col relative w-full h-full">
        <span className="absolute top-2">{label}</span>
        <input
          type="text"
          className="relative text-info text-2xl bg-transparent w-full h-full outline-none border-none"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <span className="absolute bottom-2">${price}</span>
      </div>
      <div className="flex flex-col justify-center items-center relative w-1/5 h-full">
        <div className="absolute h-full flex justify-center items-center">
          {reactNode}
        </div>
        <span className="absolute bottom-2 right-0 text-sm text-nowrap">Available: {available}</span>
      </div>
    </div>
  )
};