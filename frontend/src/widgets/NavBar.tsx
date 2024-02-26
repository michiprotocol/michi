import Logo from "@/shared/Logo";
import { Routes } from "@/constants/routes";
import classNames from "classnames";
import { ConnectKitButton } from "connectkit";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();
  const currentRoute = location.pathname;

  const { isConnected } = useAccount();
  return (
    <div className="bg-secondary-background text-info px-10 py-6 flex justify-between items-center w-full">
      <div className="flex flex-row justify-between items-center gap-6">
        <Logo />
        {isConnected && (
          <>
            <Link to={Routes.MY_WALLETS} className={classNames("text-md", {
              "underline underline-offset-4 text-blue": currentRoute === Routes.MY_WALLETS
            })}>
              My Wallets
            </Link>
            <Link to={Routes.TRADE} className={classNames("text-md", {
              "underline underline-offset-4 text-blue": currentRoute === Routes.TRADE
            })}>
              Trade
            </Link>
          </>
        )}
      </div>
      <ConnectKitButton theme="midnight" />
    </div>
  )
}