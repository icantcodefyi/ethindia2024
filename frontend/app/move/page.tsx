"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MoveHeader from "@/components/MoveHeader";
import { useEffect, useState } from "react";
import { HexString, SupraAccount, SupraClient } from "supra-l1-sdk";

export default function MovePage() {
  const [supraClient, setSupraClient] = useState<SupraClient | null>(null);
  const [senderAccount, setSenderAccount] = useState<SupraAccount | null>(null);
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState<string>("0");

  useEffect(() => {
    const initSupraClient = async () => {
      // Initialize Supra client
      const client = await SupraClient.init("https://rpc-testnet.supra.com/");
      setSupraClient(client);

      // Create a test account - in production you'd want to handle this differently
      const account = new SupraAccount(
        Buffer.from(
          "2b9654793a999d1d487dabbd1b8f194156e15281fa1952af121cc97b27578d89",
          "hex"
        )
      );
      setSenderAccount(account);

      // Check and fund account if needed
      if (!(await client.isAccountExists(account.address()))) {
        await client.fundAccountWithFaucet(account.address());
      }

      // Get initial balance
      const bal = await client.getAccountSupraCoinBalance(account.address());
      setBalance(bal.toString());
    };

    initSupraClient();
  }, []);

  const handleTransfer = async () => {
    if (!supraClient || !senderAccount || !receiverAddress || !amount) return;

    try {
      const txResData = await supraClient.transferSupraCoin(
        senderAccount,
        new HexString(receiverAddress),
        BigInt(amount),
        {
          enableTransactionWaitAndSimulationArgs: {
            enableWaitForTransaction: true,
            enableTransactionSimulation: true,
          },
        }
      );

      // Update balance after transfer
      const newBalance = await supraClient.getAccountSupraCoinBalance(
        senderAccount.address()
      );
      setBalance(newBalance.toString());

      console.log("Transfer successful:", txResData);
    } catch (error) {
      console.error("Transfer failed:", error);
    }
  };

  return (
    <>
      <MoveHeader />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Supra L1 Transfer</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Current Balance:</p>
                <p className="font-mono">{balance} SUPRA</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Sender Address:</p>
                <p className="font-mono text-sm">
                  {senderAccount?.address().toString()}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Receiver Address (hex)"
                  value={receiverAddress}
                  onChange={(e) => setReceiverAddress(e.target.value)}
                />
                <Input
                  placeholder="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Button onClick={handleTransfer}>Transfer</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
