// import type { NextFunction,Request,Response } from "express"
import jwt from "jsonwebtoken";
const isLoggedIn = (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(400).send("You must be logged in");
        }
        const data = jwt.verify(token, process.env.JWT_PASSWORD);
        if (!data && typeof data !== "object") {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = data;
        console.log("Decoded JWT:", data);
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
export default isLoggedIn;
//# sourceMappingURL=middleware.js.map