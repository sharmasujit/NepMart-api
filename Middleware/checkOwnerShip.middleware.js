import Product from "../Product/product.model.js";

//check the owner of product
export const checkProductOwnerShip=async(req,res,next)=>{
    //extract id from req.params.id
    const productId=req.params.id;

    //check the product exists in our system or not
    const product=await Product.findOne({_id:productId});

    //if not then throw error
    if(!product)
    {
        return res.status(404).send({message:"Product doesnot exists in our system."})
    }

    //check the ownership of the product
    const isProductOwner = req.loggedInUserId.equals(product.ownerId);

    //if not owner of the product then throw error
    if(!isProductOwner)
    {
        return res.status(403).send({message:"You are not owner of the product."})
    }


    next();
}