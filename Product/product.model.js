import mongoose from "mongoose";
import { Schema } from "yup";
import { productCategories } from "../Constants/general.constant.js";

//set rule
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        maxlength:30,
        required:true
    },
    brand:{
        type:String,
        trim:true,
        maxlength:30,
        required:true
    },
    price:{
        type:Number,
        min:0,
        required:true,
    },
    quantity:{
        type:Number,
        min:0,
        required:true,
    },
    category:{
        type:String,
        required:true,
        enum:productCategories
    },
    image:{
        type:String,
        required: false,
        default: null,
        nullable: true,
    },
    description:{
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users",
    },
},
{
    timestamps:true
}
)

//create table
const Product= mongoose.model("Product",productSchema);

export default Product;