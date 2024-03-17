import { Routes } from "@/constants/routes";
import MyWallets from "@/pages/MyWallets";
import Trade from "@/pages/Trade";
import NavBar from "@/widgets/NavBar";
import { Outlet, RouterProvider, createBrowserRouter, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";
import Landing from "./pages/Landing";
import NotConnected from "./shared/NotConnected";
import { Toaster } from "./shared/ui/toaster";

export default function App() {
  const router = createBrowserRouter([
    {
      element: (
        <Layout />
      ),
      children: [
        {
          path: Routes.ROOT,
          element: <Landing />,
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
  const location = useLocation();
  const currentRoute = location.pathname;
  if (currentRoute === Routes.ROOT) {
    return (
      <Landing />
    )
  }
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