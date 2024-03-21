import express from "express"
import { isBuyer } from "../Middleware/authentication.middleware.js";
import { validateReqBody } from "../Middleware/validation.middleware.js";
import { cartValidationSchema, updateQuantitySchema } from "./cart.validation.js";
import mongoose from "mongoose";
import Product from "../Product/product.model.js";
import { Cart } from "./cart.model.js";
import { checkMongoIdValidity } from "../Middleware/checkmongoId.middleware.js";


const router=express.Router()

//add product to cart
router.post("/add/cart/item",isBuyer,validateReqBody(cartValidationSchema),
async(req,res)=>{
    //extract data from req.body
    const orderedItem=req.body;

    //check the id of buyer with loggedinUser and provided id from cart
    orderedItem.buyerId=req.loggedInUserId;

    //check the provided id is mongo id or not
    const isValid=mongoose.Types.ObjectId.isValid(orderedItem.productId);

    //if not mongo id then throw error
    if(!isValid)
    {
        return res.status(400).send({message:"Invalid mongo id"});
    }

    //check if product exists or not
    const product=await Product.findOne({_id:orderedItem.productId});
    //if product is not present then throw error
    if(!product)
    {
        return res.status(404).send({message:"Product is not present in the cart."})
    }

    //check the ordered quantity and stock quantity
    if(orderedItem.orderedQuantity>product.quantity)
    {
        return res.status(422).send({message:"Product is out of numbered."})
    }

    //check the product trying to add to cart is already present in cart or not
    const cartItem= await Cart.findOne({productId:orderedItem.productId,buyerId:orderedItem.buyerId});

    //if present then,throw error
    if(cartItem)
    {
        return res.status(409).send({message:"Item is already present in cart."})
    }

    //add product to cart
    await Cart.create(orderedItem);

    //send response
    return res.status(200).send({message:"Item has been added to cart successfully."});
})

//update quantity
router.put("/item/update/quantity",isBuyer,validateReqBody(updateQuantitySchema),
async(req,res)=>{

    //extract validate data from req.body
    const updateData=req.body;

    //check the id is mongo id is
    const isValid=mongoose.Types.ObjectId.isValid(updateData.productId);
    
    //if not mongo id then,throw error
    if(!isValid)
    {
        return res.status(400).send({message:"Invalid mongo id"});
    }

    //find the product present in our system or not
    const product=await Product.findOne({_id:updateData.productId});

    //if product is not present then 
    if(!product)
    {
        return res.status(404).send({message:"Product doesnot exists in our system"});
    }
    
    //find the item in cart using productId and buyerId
    const cartItem=await Cart.findOne({productId:updateData.productId, buyerId:req.loggedInUserId});

    //if item is not in cart then throw error
    if(!cartItem)
    {
        return res.status(404).send({message:"Product is not present in cart."})
    }

    //increase or decrease the orderedQuantity by 1
    const newOrderedQuantity=updateData.action==="inc"? cartItem.orderedQuantity+1 :cartItem.orderedQuantity-1;

    //while increasing if its more than the stock then throw error
    if(newOrderedQuantity>product.quantity)
    {
        return res.status(422).send({message:"Product has been out numbered."})
    }

    //while decreasing the quantity of product it should not be less than 1
    if(newOrderedQuantity<1)
    {
        return res.status(422).send({message:"Item quantity must be atleast one."});
    }

    //update the quantity in cart
    await Cart.updateOne(
        {productId:updateData.productId , buyerId:req.loggedInUserId},
        {
            $set:{
                orderedQuantity:newOrderedQuantity
            }
        }
    );

    //send response
    return res.status(200).send({message:"Quantity is updated"});
});

// remove cart item
router.delete("/cart/remove/:id",isBuyer,checkMongoIdValidity,
async (req, res) => {
    // extract product id from req.params
    const cartId = req.params.id;
  
    // delete that product from cart
    await Cart.deleteOne({ _id: cartId, buyerId: req.loggedInUserId });
  
    // send response
    return res.status(200).send({ message: "Item is removed from cart." });
    }
);
  
// flush cart
router.delete("/cart/flush", isBuyer, 
async (req, res) => {
    // delete cart items for this buyer
    await Cart.deleteMany({ buyerId: req.loggedInUserId });
  
    //send response
    return res.status(200).send({ message: "Cart is flushed successfully." });
  }
);
  
// item list from cart
router.get("/cart/item/list", isBuyer, 
async (req, res) => {
    const cartItems = await Cart.aggregate([
        {
            $match: {
                buyerId: req.loggedInUserId,
            },
        },
        {
            $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "productData",
            },
        },
        {
            $project: {
                orderedQuantity: 1,
                name: { $first: "$productData.name" },
                brand: { $first: "$productData.brand" },
                category: { $first: "$productData.category" },
                price: { $first: "$productData.price" },
                image: { $first: "$productData.image" },
                productId: 1,
            },
        },
    ]);
    let subTotal = 0;
    
    cartItems.forEach((item) => {
      subTotal = subTotal + item.price * item.orderedQuantity;
    });
  
    const discount = (5 / 100) * subTotal;
  
    const grandTotal = subTotal - discount;
  
    return res.status(200).send({
      message: "success",
      cartData: cartItems,
      orderSummary: { subTotal, grandTotal, discount },
    });
});
  
// cart item count
router.get("/cart/item/count", isBuyer, 
async (req, res) => {
    const buyerId = req.loggedInUserId;
    const cartCount = await Cart.find({ buyerId: buyerId }).count();
    return res.status(200).send({ message: "success", cartItemCount: cartCount });
});

export default router;