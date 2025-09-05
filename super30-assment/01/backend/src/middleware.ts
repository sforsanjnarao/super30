// import type { NextFunction,Request,Response } from "express"

// import jwt from "jsonwebtoken";

// const isloggedin=(req:Request,res:Response,next:NextFunction)=>{
//     try{
//         if(req.cookies.token==='') res.status(400).send('you must be logged in')
//         else {
//             const data=jwt.verify(req.cookies?.token, process.env.JWT_PASSWORD)//decoding the token because of th secret key
//             if(!data) res.status(401).json({
//                 message:'invalid token'
//             })
//             req.user=data

//             next()

//         }} catch(err){
//             res.status(401).json({
//                 message:'invalid token'
//             })
//         }
//      //this will decode the data in the token

// }


// export default isloggedin



import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(400).send("You must be logged in");
    }

    const data = jwt.verify(token, process.env.JWT_PASSWORD!) as jwt.JwtPayload;
    if (!data && typeof data !== "object" ) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = data; 
    console.log("Decoded JWT:", data);

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default isLoggedIn;