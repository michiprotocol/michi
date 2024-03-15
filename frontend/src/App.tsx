import { Routes } from "@/constants/routes";
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import MyWallets from "@/pages/MyWallets";
import Trade from "@/pages/Trade";
import NavBar from "@/widgets/NavBar";
import { Toaster } from "./shared/ui/toaster";
import { useAccount } from "wagmi";
import NotConnected from "./shared/NotConnected";

export default function App() {
  const router = createBrowserRouter([
    {
      element: (
        <Layout />
      ),
      children: [
        {
          path: Routes.ROOT,
          element: <Navigate to={Routes.MY_WALLETS} replace />,
        },
        {
          path: Routes.MY_WALLETS,
          element: <MyWallets />,
        },
        {
          path: Routes.TRADE,
          element: <Trade />
        },
      ]
    }
  ]);

  return (
    <RouterProvider router={router} />
  )
}

function Layout() {
  const { isConnected } = useAccount();
  return (
    <div className="min-h-screen w-full bg-background text-info overflow-x-hidden">
      <NavBar />
      <div className="pt-[58px]">
        {isConnected ? (
          <Outlet />
        ) : (
          <NotConnected />
        )}
      </div>
      <Toaster />
    </div>
  )
}