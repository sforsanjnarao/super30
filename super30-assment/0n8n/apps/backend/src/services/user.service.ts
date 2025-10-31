import prisma from '../lib/prisma.ts';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface userData{
    name:string
    email:string,
    password:string
}
interface signinData{
    email:string
    password:string
}

// All the logic for signing up a user now lives here
export const signupUser = async (userData:userData) => {
    const { name, email, password } = userData;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const savedUser = await prisma.user.create({
        data: {
            userName: name,
            email: email,
            password: hashedPassword,
        },
    });

    return savedUser;
};


export const signinUser=async(signinUserData:signinData)=>{
    const {email, password}=signinUserData;
    const savedUser=await prisma.user.findUnique({
        where:{
            email:email
        }
    })
    if(!savedUser) throw new Error("please register use first")

    const checkPassword=await bcrypt.compare(password,savedUser.password as string)
    if(!checkPassword) throw new Error ('wrong credentials');

    return savedUser
}


export const getUser=async(userId:string)=>{
    const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            id: true,
            userName: true,
            email: true,
          },
        });
    return user
}