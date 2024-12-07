// ExecuteButton.tsx
import React, { useState } from "react";
import { Play, Loader2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface ExecuteButtonProps {
  blocks: BlockType[];
  values: Record<string, Record<string, string>>;
  onLog: (message: string, type: "info" | "success" | "error") => void;
  wallet: {
    address: string | null;
    instance: any;
  };
}

const CONTRACT_ADDRESS = "14xwNWLysQ6m9bwEPuuydMkvtbmVQukYgmjYLzouVF1JowHr";

const ExecuteButton: React.FC<ExecuteButtonProps> = ({
  blocks,
  values,
  onLog,
  wallet
}) => {
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    if (!wallet.address || !wallet.instance) {
      onLog("Please connect your wallet first", "error");
      return;
    }

    setIsExecuting(true);

    try {
      //@ts-ignore
      window.t = wallet.instance
      for (const block of blocks) {
        onLog(`Executing ${block.name}...`, "info");
        console.log("Executing block:", block);

        const blockIndex = blocks.indexOf(block);
        const blockValues = values[`chain-${blockIndex}`] || {};

        console.log("BLOCK VALUES:", blockValues, "Block Index: ", blockIndex)

        switch (block.id) {
          case "polkadot_transfer":
            try {
              const signer = await wallet.instance.signer;
              const payload = {
                address: CONTRACT_ADDRESS,
                method: 'transfer',
                args: [
                  blockValues["Recipient Address"],
                  blockValues["Amount"]
                ]
              };

              const signature = await signer.signRaw(payload);
              onLog(`Transfer signed: ${signature.signature}`, "success");
            } catch (error) {
              onLog(`Transfer failed: ${error}`, "error");
            }
            break;

          case "polkadot_approve":
            try {
              const signer = await wallet.instance.signer;
              const payload = {
                address: CONTRACT_ADDRESS,
                method: 'approve',
                args: [
                  blockValues["Spender Address"],
                  blockValues["Amount"]
                ]
              };

              const signature = await signer.signRaw(payload);
              onLog(`Approval signed: ${signature.signature}`, "success");
            } catch (error) {
              onLog(`Approval failed: ${error}`, "error");
            }
            break;

          case "polkadot_mint":
            try {
              console.log("Minting", blockValues["Amount"]);
              const signer = await wallet.instance.signer;
              const payload = {
                address: CONTRACT_ADDRESS,
                method: 'mint',
                args: [
                  blockValues["Amount"]
                ]
              };

              const signature = await signer.signRaw(payload);
              console.log(`Mint signed: ${signature.signature}`, "success");
              onLog(`Mint signed: ${signature.signature}`, "success");
            } catch (error) {
              onLog(`Mint failed: ${error}`, "error");
            }
            break;

          case "polkadot_burn":
            try {
              const signer = await wallet.instance.signer;
              const payload = {
                address: CONTRACT_ADDRESS,
                method: 'burn',
                args: [blockValues.amount]
              };

              const signature = await signer.signRaw(payload);
              onLog(`Burn signed: ${signature.signature}`, "success");
            } catch (error) {
              onLog(`Burn failed: ${error}`, "error");
            }
            break;

          default:
            onLog(`Unknown block type: ${block.id}`, "error");
        }
      }

      toast({
        title: "Transaction Complete",
        description: "All operations executed successfully",
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      onLog(`Error: ${errorMessage}`, "error");

      toast({
        title: "Transaction Failed",
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
      disabled={isExecuting || !wallet.address}
      className={cn(
        "px-4 py-2 rounded-xl",
        "bg-pink-500 hover:bg-pink-600",
        "text-white font-medium text-sm",
        "transition-colors",
        (isExecuting || !wallet.address) && "opacity-50 cursor-not-allowed"
      )}
    >
      {!wallet.address ? (
        <>
          <Wallet size={20} className="mr-2" />
          Connect Wallet to Execute
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
