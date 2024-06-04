import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

export const register = async(req,res) => {
    console.log(123);
    const {username, email, password} = req.body;

    const hasedPassword = await bcrypt.hash(password, 10);
   
    //CREATE A NEW USER AND SAVE TO DB
    const newUser = await prisma.user.create({
        data: {
           username,
           email,
           password : hasedPassword
        }
    });

    console.log(newUser);

}

export const login = (req,res) => {

}

export const logout = (req,res) => {

}