import Yup from "yup"


export const cartValidationSchema=Yup.object({
    productId:Yup.string().trim().required("Product Id is required"),

    orderedQuantity:Yup.number().positive("At least one product should be ordered.")
    .required("Oder quantity is required")
})

export const updateQuantitySchema=Yup.object({
    productId:Yup.string().trim().required("Product Id is required"),

    action:Yup.string().oneOf(["inc","dec"]).required("Action is required")
})