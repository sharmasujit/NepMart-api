import mongoose from "mongoose";
import { genderOption, userRoles } from "../Constants/general.constant.js";

//set rules
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        trim:true,
        required:true,
        minlength:2,
        maxlength:55,
    },
    lastName:{
        type:String,
        trim:true,
        required:true,
        minlength:3,
        maxlength:55,
    },
    email:{
        type:String,
        trim:true,
        required:true,
        maxlength:55,
        lowercase:true,
        unique:true,
    },
    password:{
        type:String,
        trim:true,
        required:true
    },
    gender:{
        type:String,
        required:false,
        enum:genderOption,
        default:null
    },
    dob:{
        type:Date,
        required:false,
        default:null,
    },
    role:{
        type:String,
        required:true,
        enum:userRoles
    }
},
{
    timestamps:true
}
);

//create table
export const User=mongoose.model("User",userSchema);