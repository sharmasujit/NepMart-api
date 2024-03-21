import jwt from "jsonwebtoken"
import { User } from "../User/user.model.js";

//user role
export const isUser=async(req,res,next)=>{
    //extract token from headers
    const authorization=req.headers.authorization;
    const splittedToken = authorization?.split(" ");
    const token=splittedToken?.length===2?splittedToken[1]:null;
    //console.log(token);
    if(!token)
    {
        return res.status(401).send({message:"Unauthorized"});
    }

    let payload;
    try {
        payload=jwt.verify(token,process.env.JWT_ACCESS_TOKEN_SECERET,process.env.JWT_ACCESS_TOKEN_EXPIRY);
    } catch (error) {  
        return res.status(401).send({message:"Unauthorized"});
    }
    
    //verify the user
    const user=await User.findOne({email:payload.email});

    if(!user){
        return res.status(401).send({message:"Unauthorized"}); 
    }

    req.loggedInUser=user;
    next();
}

//seller role
export const isSeller=async(req,res,next)=>{
    //extract token from headers
    const authorization=req.headers.authorization;
    const splittedToken = authorization?.split(" ");
    const token=splittedToken?.length===2?splittedToken[1]:null;
    //console.log(token);
    if(!token)
    {
        return res.status(401).send({message:"Unauthorized"});
    }

    let payload;
    try {
        payload=jwt.verify(token,"mysecretkey");
    } catch (error) {  
        return res.status(401).send({message:"Unauthorized"});
    }
    
    //verify the user
    const user=await User.findOne({email:payload.email});

    if(!user){
        return res.status(401).send({message:"Unauthorized"}); 
    }

    if (user.role !== "seller") {
        return res.status(401).send({ message: "Unauthorized." });
    }

    req.loggedInUser=user;
    req.loggedInUserId=user._id;
    next();
}

//buyer role
export const isBuyer=async(req,res,next)=>{
    //extract token from headers
    const authorization=req.headers.authorization;
    const splittedToken = authorization?.split(" ");
    const token=splittedToken?.length===2?splittedToken[1]:null;
    //console.log(token);
    if(!token)
    {
        return res.status(401).send({message:"Unauthorized"});
    }

    let payload;
    try {
        payload=jwt.verify(token,"mysecretkey");
    } catch (error) {  
        return res.status(401).send({message:"Unauthorized"});
    }
    
    //verify the user
    const user=await User.findOne({email:payload.email});

    if(!user){
        return res.status(401).send({message:"Unauthorized"}); 
    }

    if (user.role !== "buyer") {
        return res.status(401).send({ message: "Unauthorized." });
    }

    req.loggedInUser=user;
    req.loggedInUserId=user._id;
    next();
}