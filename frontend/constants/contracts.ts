export const SUPRA_TOKEN_CONTRACT = {
  address: "0x5c81634add84286cd674e62c1e3e9d7576b3e5cce5f41508aab836a629c0d0a",
  module: "MyToken",
};

export const createSupraTransactionData = (functionName: string, args: any[]) => {
  return {
    action: "createRawTransactionData",
    params: {
      contractAddress: SUPRA_TOKEN_CONTRACT.address,
      module: SUPRA_TOKEN_CONTRACT.module,
      function: functionName,
      args
    }
  };
}; 