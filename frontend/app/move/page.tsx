"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountInfo } from "@/components/AccountInfo";
import { NetworkInfo } from "@/components/NetworkInfo";
import { TransferAPT } from "@/components/TransferAPT";
import MoveHeader from "@/components/MoveHeader";

export default function MovePage() {
  const { connected } = useWallet();

  return (
    <>
      <MoveHeader />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex flex-col gap-8">
          {connected ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Wallet Details</CardTitle>
                </CardHeader>
                <AccountInfo />
                <NetworkInfo />
              </Card>
              
              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Transfer APT</CardTitle>
                </CardHeader>
                <TransferAPT />
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Connect your Aptos wallet to interact with the SupraChain dApp
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
} 