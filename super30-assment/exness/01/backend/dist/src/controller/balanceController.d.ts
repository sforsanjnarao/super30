import type { Request, Response } from "express";
declare let balances: Record<string, {
    balance: number;
    decimals: number;
}>;
declare const getBalanceUsd: (req: Request, res: Response) => void;
declare const getBalance: (req: Request, res: Response) => void;
declare const getSupportedAssets: (req: Request, res: Response) => void;
export { getBalanceUsd, getBalance, getSupportedAssets, balances };
//# sourceMappingURL=balanceController.d.ts.map