const yup = require('yup')

exports.addCardSchema = yup.object({
    name: yup.string(),
    number: yup.string(),
    cvv: yup.string(),
    expiryMonth: yup.string().min(2).max(2),
    expiryYear: yup.string().min(4).max(4),
})