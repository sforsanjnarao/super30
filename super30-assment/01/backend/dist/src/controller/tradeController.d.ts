import type { Request, Response } from "express";
declare const router: import("express-serve-static-core").Router;
declare const createTrade: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export default router;
declare const closeTrade: (req: Request, res: Response) => void;
export { createTrade, closeTrade };
//# sourceMappingURL=tradeController.d.ts.map