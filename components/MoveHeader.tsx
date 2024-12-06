import React from "react";
import { WalletSelector } from "./WalletSelector";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const MoveHeader = () => {
  const { network } = useWallet();

  const isTestnet = network?.name?.toLowerCase().includes("testnet");
  const networkName = network?.name || "Not Connected";

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-background backdrop-blur-md border-b border-primary/20">
      <div className="max-w-7xl mx-auto h-16 px-6">
        <div className="flex items-center justify-between h-full">
          {/* Logo and Project Name */}
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
              <img src="https://supra.com/images/brand/SupraOracles-Red-Light-Symbol.svg" width={28} height={28} alt="Supra Logo" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-xl tracking-tight text-foreground">
                ContractCraft
              </span>
              <span className="text-xs font-medium text-muted-foreground tracking-tight">
                Move Smart Contract Platform
              </span>
            </div>
          </Link>

          {/* Network Status + Wallet */}
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "hidden sm:flex items-center gap-2 px-4 py-2",
                "bg-background/50 border border-primary/20 rounded-xl",
                "backdrop-blur-md",
                "font-medium text-sm text-foreground"
              )}
            >
              <div 
                className={cn(
                  "w-2 h-2 rounded-full animate-pulse",
                  isTestnet ? "bg-yellow-500" : "bg-green-500"
                )} 
              />
              <span>{networkName}</span>
            </div>
            <WalletSelector />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoveHeader; 