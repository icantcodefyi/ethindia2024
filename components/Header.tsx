import React from "react";
import WalletConnector from "./WalletConnector";
import { Bitcoin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Header = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)]">
      <div className="max-w-7xl mx-auto  h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo and Project Name */}
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3  py-2",
              "bg-white rounded-xl",
              "hover:translate-y-[-2px]",
              "transition-all duration-200"
            )}
          >
            <div className="relative">
              <Bitcoin size={28} className="text-orange-500 animate-bounce" />
              <span className="absolute -top-1 -right-1 text-xs font-black">
                4
              </span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-xl tracking-tight">
                Bitcoin4Babies
              </span>
              <span className="text-xs font-bold text-gray-500 tracking-tight">
                b4b
              </span>
            </div>
          </Link>

          {/* Network Status + Wallet */}
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "hidden sm:flex items-center gap-2 px-4 py-2",
                "bg-white border-2 border-black rounded-xl",
                "shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
                "font-bold text-sm"
              )}
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Testnet</span>
            </div>
            <WalletConnector />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
