import { ConnectKitProvider } from "connectkit";
import "./index.css";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";

import App from "./App";
import { wagmiConfig } from "./wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <ConnectKitProvider theme="midnight" customTheme={{
          "--ck-connectbutton-background": "var(--tw-blue)",
          "--ck-connectbutton-color": "black",
          "--ck-connectbutton-border-radius": "5px",
          "--ck-connectbutton-text-transform": "uppercase",
          "--ck-font-family": 'Anta, sans-serif',
          "--ck-connectbutton-hover-background": "var(--tw-blue--hover)",
          "--ck-connectbutton-active-background": "var(--tw-blue--hover)"
        }}>
          <App />
        </ConnectKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
