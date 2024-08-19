const yup = require('yup')

exports.paymentSchema = yup.object({
    amount: yup.string().required("Please provide the amount"),
    currency: yup.string().required("Please provide the private amount"),
    userID: yup.string().required("Please provide the userID"),
    orderID: yup.string().required("Please provide the orderID"),
    return_url: yup.string().required("Please provide the return url")
})