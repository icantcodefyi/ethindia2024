"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Network, SatsWagmiConfig } from "@gobob/sats-wagmi";
const queryClient = new QueryClient();
export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <SatsWagmiConfig network={"testnet" as Network} queryClient={queryClient}>
        {children}
      </SatsWagmiConfig>
    </QueryClientProvider>
  );
}
