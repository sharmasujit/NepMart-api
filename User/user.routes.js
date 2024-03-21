import express from "express";
import { loginSchema, userSchema } from "./user.validation.js";
import { validateReqBody } from "../Middleware/validation.middleware.js";
import { User } from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router=express.Router()

//register user
router.post("/register",validateReqBody(userSchema),
async(req,res)=>{

    const newUser=req.body;

    //check if user exists in our system or not
    const user=await User.findOne({email:newUser.email});
    //if exists the throw error
    if(user)
    {
        return res.status(409).send({message:"User with this email already exists...."})
    }

    //store password in database in hash form
    const hashPassword=await bcrypt.hash(newUser.password,10)

    newUser.password=hashPassword;

    //create new user
    await User.create(newUser);

    //proper response
    return res.status(201).send({message:"User has been registered successfully"});
})

//login user
router.post("/login",validateReqBody(loginSchema),
async(req,res)=>{
    const loginCredentials=req.body;

    //check if user with email exists 
    const user=await User.findOne({email:loginCredentials.email});

    //if user doesnot exists
    if(!user)
    {
        return res.status(404).send({message:"Invalid credentials"});
    }

    //match password
    const isPassword=await bcrypt.compare(loginCredentials.password,user.password);

    //if not match 
    if(!isPassword)
    {
        return res.status(404).send({message:"Invalid credentials.."})
    }

    //generate token
    const token=jwt.sign({email:user.email},"mysecretkey",{expiresIn:"24h",});

    //hide password
    user.password=undefined;
    //response
    return res.status(200).send({message:"Success",user:user,token:token});
})



       
export default router;