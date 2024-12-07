import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getWallets } from '@talismn/connect-wallets';

const PolkaHeader = () => {
  const [walletAddress, setWalletAddress] = React.useState<string | null>(null);
  const [talismanWallet, setTalismanWallet] = React.useState<any>(null);

  const connectWallet = async () => {
    const installedWallets = getWallets().filter((wallet) => wallet.installed);
    const wallet = installedWallets.find(
      (wallet) => wallet.extensionName === 'talisman',
    );

    if (!wallet) {
      window.open('https://talisman.xyz/download', '_blank');
      return;
    }

    try {
      await wallet.enable('ContractCraft');
      setTalismanWallet(wallet);
      wallet.subscribeAccounts((accounts: any[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0].address);
        } else {
          setWalletAddress(null);
        }
      });
    } catch (err) {
      console.error("Failed to connect to Talisman:", err);
    }
  };

  const disconnectWallet = async () => {
    if (talismanWallet) {
      setWalletAddress(null);
      setTalismanWallet(null);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-background backdrop-blur-md border-b border-primary/20">
      <div className="max-w-7xl mx-auto h-16 px-6">
        <div className="flex items-center justify-between h-full">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 py-2",
              "rounded-xl",
              "hover:translate-y-[-2px]",
              "transition-all duration-200"
            )}
          >
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/polkadot-logo.svg" width={28} height={28} alt="Polkadot Logo" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-xl tracking-tight text-foreground">
                ContractCraft
              </span>
              <span className="text-xs font-medium text-muted-foreground tracking-tight">
                Polkadot Smart Contract Platform
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {walletAddress ? (
              <div className="flex items-center gap-4">
                <div className={cn(
                  "hidden sm:flex items-center gap-2 px-4 py-2",
                  "bg-background/50 border border-primary/20 rounded-xl",
                  "backdrop-blur-md",
                  "font-medium text-sm text-foreground"
                )}>
                  <div className="w-2 h-2 rounded-full animate-pulse bg-green-500" />
                  <span className="w-full">{walletAddress}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className={cn(
                  "px-4 py-2 rounded-xl",
                  "bg-pink-500 hover:bg-pink-600",
                  "text-white font-medium text-sm",
                  "transition-colors"
                )}
              >
                Connect Talisman
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolkaHeader; 