import { ConnectKitProvider } from "connectkit";
import "./global.css";
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
        <ConnectKitProvider theme="midnight">
          <App />
        </ConnectKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
