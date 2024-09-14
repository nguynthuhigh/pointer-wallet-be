const yup = require('yup')

exports.voucherSchema = yup.object({
    title: yup.string().required("Title date is required"),
    content: yup.string().required("Content date is required"),
    quantity: yup.number().min(1,"Quantity is more than 1"),
    discountValue: yup.number().required("Discount value is required").min(1,"Discount value is more than 1"),
    type: yup.string().required("Type is required"),
    min_condition: yup.number().required("Minimum value is required").min(0,"Minimum is more than 0"),
    code: yup.string().required("Code value is required"),
    currency: yup.string().required("Currency is required")
})

