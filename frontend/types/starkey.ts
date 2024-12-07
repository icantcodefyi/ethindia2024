export interface Transaction {
  data?: string;
  from: string;
  to: string;
  value: string | number;
}

export interface StarKeyProvider {
  supra: {
    connect: () => Promise<string[]>;
    disconnect: () => Promise<void>;
    on: (event: string, callback: (accounts: string[]) => void) => void;
    sendTransaction: (transaction: Transaction) => Promise<string>;
  };
}

declare global {
  interface Window {
    starkey?: StarKeyProvider;
  }
} 