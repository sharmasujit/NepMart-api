import mongoose from "mongoose"

// const dbUserName=process.env.DB_USERNAME;
// const dbPassword=process.env.DB_PASSWORD;
// const dbName=encodeURIComponent(process.env.DB_NAME);
export const connectDb=async()=>{
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Database has been connected successfully.");
    } catch (error) {
        console.log("Database connection has been failed..");
        console.log(error.message);
    }
}

//export default connectDb;
// PORT=8000
// DB_URL=mongodb+srv://sujit:sujit@cluster0.3fthfcl.mongodb.net/Shopping?retryWrites=true&w=majority&appName=Cluster0
// JWT_ACCESS_TOKEN_SECERET=mysecretkey
// JWT_ACCESS_TOKEN_EXPIRY=1d