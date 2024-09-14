const yup = require('yup')

exports.sendMoney = yup.object({
    
})

exports.depositMoneySchema = yup.object({
    currency: yup.string().required("Currency is required"),
    cardID: yup.string().required("Card ID is required"),
    security_code: yup.string().required("Security code is required"),
    amount: yup.string().required("Amount is required"),
})