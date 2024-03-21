import express from "express";
import { isBuyer, isSeller, isUser } from "../Middleware/authentication.middleware.js";
import { validateReqBody } from "../Middleware/validation.middleware.js";
import { paginationSchema, productSchema } from "./product.validation.js";
import Product from "./product.model.js";
import { checkMongoIdValidity } from "../Middleware/checkmongoId.middleware.js";
import { checkProductOwnerShip } from "../Middleware/checkOwnerShip.middleware.js";

const router=express.Router();

//add a product
router.post("/add",validateReqBody(productSchema),isSeller,
async(req,res)=>{
    //extract data from req.body
    const newProduct=req.body;

    //need to find the id of the owner of the product
    newProduct.ownerId=req.loggedInUser._id;

    //create product
    await Product.create(newProduct);

    //send response
    return res.status(200).send({message:"Product has been added successfully"});
})

//get product details by id
router.get("/details/:id",isUser,checkMongoIdValidity,
async(req,res)=>{
    //extract id from req.params
    const productId=req.params.id;
    
    //find the product
    const requiredProduct=await Product.findOne({_id:productId});

    //if product is not present then
    if(!requiredProduct)
    {
        return res.status(404).send({message:"Product doesnot exists.."});  
    }

    requiredProduct.ownerId=undefined;

    //show the details of product as response
    return res.status(200).send({message:"Success",product:requiredProduct});
})

//delete product using id
router.delete("/delete/:id",isSeller,checkMongoIdValidity,checkProductOwnerShip,
async(req,res)=>{
    const productId=req.params.id;

    //delete product
    await Product.deleteOne({_id:productId});

    //response
    return res.status(200).send({message:"Product has been deleted successfully"});
})

//update product using id
router.put("/edit/:id",isSeller,checkMongoIdValidity,validateReqBody(productSchema),checkProductOwnerShip,
async(req,res)=>{
    //extract id from req.params
    const productId=req.params.id;

    //extract updated value from req.boy
    const newValues=req.body;
  
    //update product
    await Product.updateOne({_id:productId},{$set:{...newValues}});

    //send response
    return res.status(200).send({message:"Product has been updated successfully."})
})

//get product list for buyer
router.post("/buyer/list",isBuyer,validateReqBody(paginationSchema),
async(req,res)=>{
    //extract pagination data from req.body
    const {page,limit,searchText}=req.body;

    //calculate skip
    const skip= (page-1)*limit;

    // filter stage
    let match = {};

    if (searchText) {
      match = { name: { $regex: searchText, $options: "i" } };
    }

    // query
    const products = await Product.aggregate([
        {
          $match: match,
        },
        {
          $sort:{createdAt:-1}
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
        {
          $project: {
            name: 1,
            price: 1,
            brand: 1,
            image: 1,
            description:{$substr:["$description",0,200]},
          },
        },
      ]);

    //calculate number of pages
    const totalProduct=await Product.find({}).countDocuments();
    const numberOfPages= Math.ceil(totalProduct/limit);

    //send response
    return res.status(200).send({ message: "success", products: products ,numberOfPages})
});

//get product list for seller
router.post("/seller/list",isSeller,validateReqBody(paginationSchema),
async(req,res)=>{
    // extract pagination data from req.body
    const { page, limit, searchText } = req.body;
    
    // calculate skip
    const skip = (page - 1) * limit;
    
    // filter stage
    let match = { ownerId: req.loggedInUserId };
    
    if (searchText) {
        match = {
            ownerId: req.loggedInUserId,
            name: { $regex: searchText, $options: "i" },
        };
    }
    
    let products = await Product.aggregate([
        {
          $match: match,
        },
        {
          $sort:{createdAt:-1}
        },
        {
          $skip: skip,
        },
        { $limit: limit },
        {
          $project: {
            name: 1,
            brand: 1,
            price: 1,
            image: 1,
            description:{$substr:["$description",0,200]},
          },
        },
    ]);
  //calculate number of pages
  const totalProduct=await Product.find(match).countDocuments();
  const numberOfPages=Math.ceil(totalProduct/limit);
  
  //send response
    return res.status(200).send({ message: "success", products: products,numberOfPages });
})

//get all products for carousel
router.get("/carousel/list", async (req, res) => {
  const products = await Product.find({
  },);

  const carouselProducts = products.map((product) => ({
    name: product.name,
    price: product.price,
    brand: product.brand,
    image: product.image,
    description: product.description.substring(0, 200),
  }));
  return res.status(200).send({
    message: "success",
    products: carouselProducts,
  });
});


export default router;