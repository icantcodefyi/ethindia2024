import { createThirdwebClient } from "thirdweb";
import { createWallet } from "thirdweb/wallets";
import { useState, useCallback } from 'react';
import { useActiveAccount } from "thirdweb/react";

interface Wallet {
    address: string;
    providerName: "thirdweb" | "cdk";
}

interface UseWalletReturn {
    wallet: Wallet | null;
    connect: (providerName: "thirdweb" | "cdk") => Promise<void>;
    disconnect: () => void;
    isConnecting: boolean;
    error: Error | null;
}

export function useWallet(): UseWalletReturn {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const thirdwebAddress = useActiveAccount();

    const connect = useCallback(async (providerName: "thirdweb" | "cdk") => {
        setIsConnecting(true);
        setError(null);

        try {
            if (providerName === "thirdweb") {
                const client = createThirdwebClient({
                    clientId: "07edaeb20640aa496191f50d884c2dda",
                });

                const metamaskWallet = createWallet("io.metamask");

                await metamaskWallet.connect({
                    client,
                    walletConnect: {
                        projectId: "07edaeb20640aa496191f50d884c2dda",
                        showQrModal: true,
                        appMetadata: {
                            name: "My App",
                            url: "https://my-app.com",
                            description: "my app description",
                            logoUrl: "https://path/to/my-app/logo.svg",
                        },
                    },
                });

                setWallet({
                    address: thirdwebAddress?.address || "",
                    providerName: "thirdweb"
                });
            } else {
                // CDK connection logic would go here
                // This is just a placeholder - implement actual CDK connection
                const mockAddress = "0x..."; // Replace with actual CDK connection
                setWallet({
                    address: mockAddress,
                    providerName: "cdk"
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to connect wallet'));
        } finally {
            setIsConnecting(false);
        }
    }, []);

    const disconnect = useCallback(() => {
        setWallet(null);
        setError(null);
    }, []);

    return {
        wallet,
        connect,
        disconnect,
        isConnecting,
        error
    };
}

