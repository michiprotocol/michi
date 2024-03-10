import { Routes } from "@/constants/routes";
import { Link } from "react-router-dom";

export default function Logo() {

  return (
    <Link to={Routes.MY_WALLETS}>
      <img
        src="/assets/logo.png"
        alt="Logo"
        width={30}
        height={30}
      />
    </Link>
  )
}