import { Routes } from "@/constants/routes";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import MyWallets from "@/pages/MyWallets";
import Trade from "@/pages/Trade";
import NavBar from "@/widgets/NavBar";

export default function App() {

  const router = createBrowserRouter([
    {
      element: (
        <Layout />
      ),
      children: [
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
  return (
    <div className="min-h-screen w-full bg-background text-info overflow-x-hidden">
      <NavBar />
      <Outlet />
    </div>
  )
}