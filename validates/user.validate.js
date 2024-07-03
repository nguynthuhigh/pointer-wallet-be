const yup = require('yup')

exports.registerSchema = yup.object({
    email: yup.string().required("Vui lòng điền số diền thoại"),
    password: yup.string().required("Vui lòng nhập mật khẩu")
})

