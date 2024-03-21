import mongoose from "mongoose";
//set rule
const cartSchema=new mongoose.Schema({
    buyerId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"users"
    },

    productId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"products"
    },

    orderedQuantity:{
        type:Number,
        min:1,
        required:true
    }
});

//create table
export const Cart=mongoose.model("Cart",cartSchema);