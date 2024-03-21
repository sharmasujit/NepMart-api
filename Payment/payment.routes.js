import express from "express";
import { isBuyer } from "../Middleware/authentication.middleware.js";
import axios from "axios";
import Order from "../Order/order.model.js";
import { uuid } from "uuidv4";
import { Cart } from "../Cart/cart.model.js";

const router=express.Router()

//start payment
router.post("/payment/khalti/start",isBuyer,
async(req,res)=>{
    const {amount,productList}=req.body;

    //buyerId
    const buyerId=req.loggedInUserId;

    try {
        //initiate a payment
        const response=await axios.post("https://a.khalti.com/api/v2/epayment/initiate/",{
            return_url: "https://nep-mart.netlify.app/payment/khalti/success/", //using host url
            //return_url: "https:/localhost:5173/payment/khalti/success/", //use when using localhost

            website_url: "https://nep-mart.netlify.app",//using host url
            //website_url: "https:/localhost:5173",  //use when using localhost

            amount: +amount * 100,  //convert into paisa
            purchase_order_id: uuid(),
            purchase_order_name: "items",
        },
        {
            headers:{
                Authorization:"key 571366990dbb4b08aa0b6880d773fe20",
                "Content-Type": "application/json",
            }
        });

        const pidx=response?.data?.pidx;

        //create order
        await Order.create({
            buyerId,
            productList,
            totalAmount: amount,
            pidx,
            paymentStatus: "Initiated",
        });
        return res.status(200).send({ message: "success", paymentInfo: response.data });

    } catch (error) {
        return res.status(500).send({message:error.message})
    }
});

router.post("/payment/khalti/success", isBuyer, async (req, res) => {
    // extract pidx from req.body
    const { pidx } = req.body;
  
    // hit look up api from khalti
  
    try {
        const response = await axios.post("https://a.khalti.com/api/v2/epayment/lookup/",
        {
          pidx,
        },
        {
            headers: {
                Authorization: "key 571366990dbb4b08aa0b6880d773fe20",
                "Content-Type": "application/json",
            },
        });
        await Order.updateOne({ pidx },
        {
            $set: {
                paymentStatus: response?.data?.status,
            },
        });
        
        if (response?.data?.status !== "Completed") {
            return res.status(500).send({ message: "Payment is unsuccessful." });
        }
        
        await Cart.deleteMany({ buyerId: req.loggedInUserId });
        return res.status(200).send({ message: response?.data?.status });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

export default router;