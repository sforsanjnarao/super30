// const jwt= require('jsonwebtoken')
// const { Resend } = require("resend") 
// const signup=async (req,res)=>{
//     const {email}=req.body;
//     if(!email){
//         throw console.error('email is required');
//     }
//     try{
//         const token=jwt.sign(email,process.env.JWT_PASSWORD)
//         res.cookie('token',token)  //saving in cookie
//         res.status(200).json({ token,
//             message:'registered'
//         })
//     }catch(err){
//         res.status(400).json({
//             message:'user failed'
//         })
//     }
// }
//     const signin=async (req,res)=>{
//     const {email}=req.body
//     if(!email){
//         throw console.error('email is required');
//     }
//     try{
//         const user= await userModel.findOne({
//             email:email
//         })
//         const token = jwt.sign(user._id, process.env.JWT_PASSWORD)
//         res.cookie('token',token)  //saving in cookie
//         return res.status(200).json({ token,
//             message:'registered'
//         })
//     }catch(err){
//         res.status(400).json({
//             message:'user failed'
//         })
//     }
// }
// const resend = new Resend("re_xxxxxxxxx");
// const emailVerfy= async (req,res) => {
//   const { data, error } = await resend.emails.send({
//     from: "Acme <onboarding@resend.dev>",
//     to: ["delivered@resend.dev"],
//     subject: "hello world",
//     html: "<strong>it works!</strong>",
//   });
//   if (error) {
//     return res.status(400).json({ error });
//   }
//   res.status(200).json({ data });
// };
// module.exports={signup, signin, emailVerfy}
import jwt from "jsonwebtoken";
import { Resend } from "resend";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // keep safe
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const resend = new Resend(process.env.RESEND_API_KEY);
const auth = async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ error: "Email required" });
    const token = jwt.sign({ email }, JWT_SECRET);
    const link = `http://localhost:3000/api/v1/auth/verify?token=${token}`;
    try {
        ;
        const { data, error } = await resend.emails.send({
            from: "login@yourdomain.com",
            to: email,
            subject: "Your Magic Login Link",
            html: `<p>Click to log in:</p><a href="${link}">sign in</a>`,
        });
        res.status(200).json({ message: "Check your email for the login link" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};
const emailVerfy = (req, res) => {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
        return res.status(400).json({ error: "Token is required" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded !== "object" || !decoded.email) {
            return res.status(400).json({ error: "Invalid token payload" });
        }
        const session = jwt.sign({ email: decoded.email }, JWT_SECRET);
        res.cookie("token", session);
        res.redirect(`${FRONTEND_URL}/dashboard`);
    }
    catch (err) {
        return res.status(400).json({ error: "Invalid or expired token" });
    }
};
const getMe = (req, res) => {
    const token = req.cookies.auth;
    if (!token)
        return res.status(401).json({ error: "Not logged in" });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded !== "object" || !decoded.email) {
            return res.status(400).json({ error: "Invalid token payload" });
        }
        res.json({ email: decoded.email });
    }
    catch {
        res.status(401).json({ error: "Invalid session" });
    }
};
//# sourceMappingURL=userController.js.map