import type { Request, Response } from "express";
declare const auth: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const emailVerify: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
declare const getMe: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
export { auth, emailVerify, getMe };
//# sourceMappingURL=userController.d.ts.map