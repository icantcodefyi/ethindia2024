"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import MoveHeader from "@/components/MoveHeader";
import { useEffect, useState } from "react";
import { StarKeyProvider } from "@/types/starkey";

export default function MovePage() {
  const [starkeyConnected, setStarkeyConnected] = useState(false);
  const [starkeyAddress, setStarkeyAddress] = useState<string | null>(null);

  const getStarkeyProvider = (): StarKeyProvider['supra'] | null => {
    if ('starkey' in window && window.starkey?.supra) {
      return window.starkey.supra;
    }
    window.open('https://starkey.app/', '_blank');
    return null;
  };

  const connectStarkey = async () => {
    const provider = getStarkeyProvider();
    if (!provider) return;

    try {
      const accounts = await provider.connect();
      if (accounts[0]) {
        setStarkeyAddress(accounts[0]);
        setStarkeyConnected(true);
      }
    } catch (err) {
      console.error("Failed to connect to StarKey:", err);
    }
  };

  const disconnectStarkey = async () => {
    const provider = getStarkeyProvider();
    if (!provider) return;

    try {
      await provider.disconnect();
      setStarkeyAddress(null);
      setStarkeyConnected(false);
    } catch (err) {
      console.error("Failed to disconnect StarKey:", err);
    }
  };

  useEffect(() => {
    const provider = getStarkeyProvider();
    if (provider) {
      provider.on('accountChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setStarkeyAddress(accounts[0]);
          setStarkeyConnected(true);
        } else {
          setStarkeyAddress(null);
          setStarkeyConnected(false);
        }
      });
    }
  }, []);

  return (
    <>
      <MoveHeader />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex flex-col gap-8">
         hi
        </div>
      </main>
    </>
  );
} 