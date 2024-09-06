const userService = require('../../services/user.services')
const { Response } = require('../../utils/response')
const catchError = require('../../middlewares/catchError.middleware')
const uploadImage = require('../../helpers/upload_cloudinary')
module.exports = {
    changePassword: catchError(async(req,res)=>{
        await userService.changePassword(req.body.old_password,req.body.new_password,req.user_info)
        Response(res,"Đổi mật khẩu thành công",null,200)
    }),
    changeSecurityCode: catchError(async(req,res)=>{
        await userService.changeSecurityCode(req.body.old_code,req.body.new_code,req.user_info)
        Response(res,"Đổi mã bảo mật thành công",null,200)
    }),
    editProfile: catchError(async(req,res)=>{
        let url = null
        if(req.file.path){
            url = await uploadImage.upload(req.file.path)
        }
        await userService.editProfile({
            ...req.body,
            avatar:url,
            _id:req.user
        })
        Response(res,"Cập nhật thông tin thành công",null,400)
    }),
}