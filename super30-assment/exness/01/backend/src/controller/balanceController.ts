import type { Request, Response } from "express";

// Mock balances (later engine will update these)
let balances: Record<string, { balance: number; decimals: number }> = {
  USD: { balance: 200000, decimals: 2 },
  BTC: { balance: 10000000, decimals: 4 },
};

const supportedAssets = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    // imageUrl: "https://image.com/png",
    
  },
  {
    symbol: "ETH",
    name: "Ethereum",
  },
];

const getBalanceUsd = (req: Request, res: Response) => {
  res.json({ balance: balances.USD!.balance });
};

const getBalance = (req: Request, res: Response) => {
  const response: Record<string, { balance: number; decimals: number }> = {};
  for (const [symbol, data] of Object.entries(balances)) {
    if (symbol !== "USD") {
      response[symbol] = data;
    }
  }
  res.json(response);
};

const getSupportedAssets = (req: Request, res: Response) => {
  res.json({ assets: supportedAssets });
};

export { getBalanceUsd, getBalance, getSupportedAssets, balances };