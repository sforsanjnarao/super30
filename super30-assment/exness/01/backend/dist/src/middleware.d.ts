import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
declare global {
    namespace Express {
        interface Request {
            user?: string | JwtPayload;
        }
    }
}
declare const isLoggedIn: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default isLoggedIn;
//# sourceMappingURL=middleware.d.ts.map