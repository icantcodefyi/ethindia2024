// ExecuteButton.tsx
import React, { useState } from "react";
import { Play, Loader2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { BlockType } from "@/constants/paths";
import { StarKeyProvider } from "@/types/starkey";

interface ExecuteButtonProps {
  blocks: BlockType[];
  values: Record<string, Record<string, string>>;
  onLog: (message: string, type: "info" | "success" | "error") => void;
}

const ExecuteButton: React.FC<ExecuteButtonProps> = ({
  blocks,
  values,
  onLog,
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [starkeyAddress, setStarkeyAddress] = React.useState<string | null>(null);

  const getStarkeyProvider = (): StarKeyProvider['supra'] | null => {
    if ('starkey' in window && window.starkey?.supra) {
      return window.starkey.supra;
    }
    return null;
  };

  // Add effect to monitor StarKey connection
  React.useEffect(() => {
    const provider = getStarkeyProvider();
    if (provider) {
      provider.on('accountChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setStarkeyAddress(accounts[0]);
        } else {
          setStarkeyAddress(null);
        }
      });
    }
  }, []);

  const handleExecute = async () => {
    if (!starkeyAddress) {
      const provider = getStarkeyProvider();
      if (!provider) {
        window.open('https://starkey.app/', '_blank');
        return;
      }

      try {
        const accounts = await provider.connect();
        if (accounts[0]) {
          setStarkeyAddress(accounts[0]);
        }
      } catch (err) {
        console.error("Failed to connect to StarKey:", err);
        onLog("Failed to connect wallet", "error");
        return;
      }
    }

    setIsExecuting(true);

    try {
      for (const block of blocks) {
        onLog(`Executing ${block.name}...`, "info");
        const blockIndex = blocks.indexOf(block);
        const blockValues = values[`chain-${blockIndex}`] || {};

        try {
          const provider = getStarkeyProvider();
          if (!provider) throw new Error("StarKey provider not found");

          switch (block.id) {
            // case "evm_mint":
            //   if (!blockValues["Account Address"] || !blockValues["Amount"]) {
            //     throw new Error("Missing required parameters for mint");
            //   }
            //   sendTransaction(prepareContractCall({
            //     contract,
            //     method: "function mint(address _to, uint256 _value)",
            //     params: [blockValues["Account Address"], BigInt(blockValues["Amount"])],
            //   }));
            //   break;

            default:
              onLog(`Unknown block type: ${block.id}`, "error");
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
          onLog(`Error executing ${block.name}: ${errorMessage}`, "error");
          throw error;
        }
      }

      toast({
        title: "Operations Complete",
        description: "All operations executed successfully",
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Operation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Button
      onClick={handleExecute}
      disabled={isExecuting}
      className={cn(
        "px-4 py-2 rounded-xl",
        "bg-pink-500 hover:bg-pink-600",
        "text-white font-medium text-sm",
        "transition-colors",
        isExecuting && "opacity-50 cursor-not-allowed"
      )}
    >
      {!starkeyAddress ? (
        <>
          <Wallet size={20} className="mr-2" />
          Connect StarKey to Execute
        </>
      ) : isExecuting ? (
        <>
          <Loader2 size={20} className="mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Play size={20} className="mr-2" />
          Execute Transaction
        </>
      )}
    </Button>
  );
};

export default ExecuteButton;
