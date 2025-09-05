import type { Request, Response } from "express";

const getBalanceUsd = (req: Request, res: Response) => {
    res.send('get balance usd');
}

const getBalanceInr = (req: Request, res: Response) => {
    res.send('get balance inr');
}

export { getBalanceUsd, getBalanceInr }