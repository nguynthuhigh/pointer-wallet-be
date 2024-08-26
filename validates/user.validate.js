const yup = require('yup')

exports.registerSchema = yup.object({
    email: yup.string().required("Vui lòng điền số điền thoại"),
    password: yup.string().required("Vui lòng nhập mật khẩu")
})

