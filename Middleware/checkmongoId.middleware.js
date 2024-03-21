import mongoose from "mongoose"


export const checkMongoIdValidity = (req, res, next) => {

    //extract id from req.params and check the provided id is mongo id or not 
    const isValidMongoId = mongoose.Types.ObjectId.isValid(req.params.id);
    //if not then throw error
    if (!isValidMongoId) {
        return res.status(400).send({ message: "Invalid mongo id" });
    }

    next();
}