
export const validateReqBody=(validationSchema)=>{
    return async(req,res,next)=>{
        //extract data from req.body
        const newData=req.body;
        
        let validatedData;
    
        //validate the extracted data
        try {
            validatedData=await validationSchema.validate(newData);

            //if validation fails then throw error
        } catch (error) {
            return res.status(400).send({message:error.message});
        }
        req.body=validatedData;
        next();
    }
}
