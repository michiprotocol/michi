import { Link } from "react-router-dom";
import "./Landing.css";
import { Routes } from "@/constants/routes";

export default function Landing() {



  return (
    <div className="landing-page flex flex-col items-center min-h-screen w-full text-white bg-[#080A14]">
      <div className="flex flex-row justify-between items-center py-5 px-10 w-full">
        <img src="/assets/landing/landing-logo.png" alt="landing logo" />
        <button className="btn michi-gradient text-white font-bold px-8">
          <Link to={Routes.MY_WALLETS}>Launch App</Link>
        </button>
      </div>
      <div className="landing-hr" />
      <div className="flex md:h-screen md:p-0 py-10 md:flex-row flex-col gap-10 md:justify-between items-center md:w-[80%] w-full">
        <div className="flex items-start flex-col gap-10">
          <span className="michi-gradient text-[100px] font-black text-white rounded-[15px] px-10">
            Michi
          </span>
          <div className="flex flex-col">
            <span className="font-extrabold whitespace-nowrap text-white text-[50px]">The First Trustless Points</span>
            <span className="font-bold whitespace-nowrap text-[70px] text-white">Trading Protocol</span>
          </div>
        </div>
        <img src="/assets/landing/phone.png" alt="phone" />
      </div>
      <div className="landing-hr" />
      <div className="flex flex-col items-center justify-center gap-32 h-[80vh]">
        <span className="text-[50px] font-extrabold text-slate-400">About Us</span>
        <div className="flex flex-row justify-between items-center gap-10 w-full">
          <img src="/assets/landing/btc-eth.png" alt="btc-eth" width={558} height={350} />
          <img src="/assets/landing/three-points.png" alt="three-points" width={558} height={360} />
        </div>
      </div>
      <div className="flex flex-row h-[80vh] justify-between items-center gap-10">
        <div className="flex flex-col gap-8">
          <span className="text-[48px] font-bold">Intergration With Pendle</span>
          <div className="flex flex-col">
            <span className="text-[16px] font-medium">Michi supports Yield Tokens from Pendle for deposits</span>
            <span className="text-16px] font-medium w-[60%]">Pendle YT allow you to earn points at an accelerated rate while having no exposure to the underlying asset </span>
          </div>
        </div>
        <img src="/assets/landing/pendle.png" alt="pendle" width={461} height={464} />
      </div>
      <div className="flex flex-row-reverse h-[80vh] w-full px-52 justify-between items-center gap-10">
        <div className="flex flex-col gap-8 w-1/2">
          <span className="text-[48px] font-bold">Built on ERC-6551</span>
          <div className="flex flex-col">
            <span className="text-[16px] font-medium w-[50%]">Earn points through an ERC-6551 wallet that is owned by an NFT. Trade the NFT to trade custody of all points earned</span>
          </div>
        </div>
        <img src="/assets/landing/eth-nft.png" alt="eth-nft" width={406} height={471} />
      </div>
      <div className="flex flex-col h-[80vh] justify-center items-center gap-20">
        <span className="text-[48px] font-bold">Process</span>
        <div className="flex flex-row items-center gap-3">
          <img src="/assets/landing/process-1.png" alt="process-1" width={366} height={263} />
          <img src="/assets/landing/process-2.png" alt="process-2" width={366} height={263} />
          <img src="/assets/landing/process-3.png" alt="process-3" width={366} height={263} />
        </div>
      </div>
      <div className="landing-hr" />
      <div className="flex flex-row justify-between w-full px-20 py-10">
        <img src="/assets/landing/landing-logo.png" alt="landing logo" />
        <div className="flex flex-row items-center gap-3">
          <img src="/assets/landing/tg.png" alt="tg" />
          <img src="/assets/landing/x.png" alt="x" />
          <img src="/assets/landing/youtube.png" alt="youtube" />
          <img src="/assets/landing/discord.png" alt="discord" />
        </div>
      </div>
      <span className="text-center text-[16px] text-slate-400 pb-5">© All rights reserved</span>
    </div>
  )
}