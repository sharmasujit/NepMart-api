import express from "express";
import userRoutes from "./User/user.routes.js";
import {connectDb} from "./db.connect.js";
import productRoutes from "./Product/Product.route.js";
import cartRoutes from "./Cart/cart.route.js";
import cors from "cors";
import paymentRoutes from "./Payment/payment.routes.js";
import orderRoutes from "./Order/order.routes.js";

const app=express()
app.use(express.json());

//cors
app.use(cors())

//connnect db
connectDb();

//register routes
app.use("/user",userRoutes);
app.use("/product",productRoutes);
app.use(cartRoutes);
app.use(paymentRoutes);
app.use(orderRoutes);

const PORT=process.env.PORT;

app.listen(PORT,()=>{
    console.log(`App is listening at port ${PORT}`);
});