const yup = require('yup')

exports.addCardSchema = yup.object({
    name: yup.string().required("Vui lòng nhập tên thẻ"),
    number: yup.string().min(12,"Số thẻ không hợp lệ").max(16,"Số thẻ không hợp lệ").required("Vui lòng nhập số thẻ"),
    cvv: yup.string().min(3).max(3).required("Vui lòng nhập CVV"),
    expiryMonth: yup.string().min(2).max(2).required("Vui lòng nhập tháng"),
    expiryYear: yup.string().min(4).max(4).required("Vui lòng nhập năm"),
})