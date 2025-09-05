import type { NextFunction, Request, Response } from "express";
declare const isLoggedIn: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default isLoggedIn;
//# sourceMappingURL=middleware.d.ts.map