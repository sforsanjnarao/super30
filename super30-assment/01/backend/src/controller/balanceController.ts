import type { Request, Response } from "express";

const getBalanceUsd = (req: Request, res: Response) => {
    res.send('get balance usd');
}



export { getBalanceUsd }