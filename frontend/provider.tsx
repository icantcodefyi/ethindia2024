"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base } from "viem/chains";
import { Network, SatsWagmiConfig } from "@gobob/sats-wagmi";
import { ThirdwebProvider } from "thirdweb/react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { WalletProvider } from "./providers/WalletProvider";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { RiseWallet } from "@rise-wallet/wallet-adapter";
import { FewchaWallet } from "fewcha-plugin-wallet-adapter";
import { NightlyWallet } from "@nightlylabs/aptos-wallet-adapter-plugin";
import { OpenBlockWallet } from "@openblockhq/aptos-wallet-adapter";
import { TokenPocketWallet } from "@tp-lab/aptos-wallet-adapter";
import { TrustWallet } from "@trustwallet/aptos-wallet-adapter";
import { WelldoneWallet } from "@welldone-studio/aptos-wallet-adapter";
import { createThirdwebClient } from "thirdweb";

export const client = createThirdwebClient({
  clientId: "07edaeb20640aa496191f50d884c2dda"
});

const queryClient = new QueryClient();

const wallets = [
  new PetraWallet(),
  new MartianWallet(),
  new PontemWallet(),
  new RiseWallet(),
  new FewchaWallet(),
  new NightlyWallet(),
  new OpenBlockWallet(),
  new TokenPocketWallet(),
  new TrustWallet(),
  new WelldoneWallet(),
];

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>
        <OnchainKitProvider
          apiKey="uaBZtCjdJYxz2ViQAjIaEq2e5RDirLBY"
          chain={base}
        >
          <SatsWagmiConfig
            network={"testnet" as Network}
            queryClient={queryClient}
          >
            <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
              <WalletProvider>{children}</WalletProvider>
            </AptosWalletAdapterProvider>
          </SatsWagmiConfig>
        </OnchainKitProvider>
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}
