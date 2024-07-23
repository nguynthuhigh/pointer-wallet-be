const yup = require('yup')

exports.addCardSchema = yup.object({
    private_key: yup.string().required("Please provide the private key"),
    amount: yup.string().required("Please provide the amount"),
    currency: yup.string().required("Please provide the private amount"),
    userID: yup.string().required("Please provide the userID"),
    orderID: yup.string().required("Please provide the orderID"),
    return_url: yup.string().require("Please provide the return url")
})