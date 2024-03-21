import * as Yup from "yup";
import { genderOption, userRoles } from "../Constants/general.constant.js";

export const userSchema=Yup.object({
    firstName:Yup.string().min(2,"First name must be atleast two character..")
    .max(55,"First name must not exceed 55 character").trim()
    .required("First name is required"),

    lastName:Yup.string().min(3,"Last name must be atleast three character..")
    .max(55,"Last name must not exceed 55 character").trim()
    .required("Last name is required"),

    email:Yup.string().email("Must be valid email").max(55,"First name must not exceed 55 character")
    .lowercase().trim().required("Email is required"),
    
    password:Yup.string().trim().required("Password is required"),

    //gender:Yup.string().oneOf(genderOption).default(null),

    //dob:Yup.date().required().default(null),

    role:Yup.string().oneOf(userRoles).required("Role is requiured")  
});

export const loginSchema=Yup.object({
    email:Yup.string().email("Must be valid email").lowercase().trim().required("Email is required"),
    
    password:Yup.string().trim().required("Password is required"),
})