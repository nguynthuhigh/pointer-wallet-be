const tokenAuth = require('../services/token.services')
const { User } = require('../models/user.model');
const {Partner} = require('../models/partner.model')
const {Admin} = require('../models/admin.model')
const ROLE = require('../contains/role')
const {Response} = require('../utils/response');
const AppError = require('../helpers/handleError');
const catchError = require('../middlewares/catchError.middleware')
exports.Authentication_Admin = (role)=>{
    return async  (req, res, next) => {
        const token = req.headers.authorization?.slice(7);
        if(token){
            try {
                const result = await tokenAuth.verifyToken(token);
                const admin = await Admin.findById(result.id);
                if(admin.active === false){
                    return Response(res,"Mày bị ban!",null,401)
                }
                if(admin && (role.includes(admin.role) || ROLE.ADMIN.includes(admin.role))){
                    req.admin = admin
                    return next();
                } else {
                    return Response(res,"Unauthorized",null,401)
                }
            } catch (err) {
               return Response(res,"Error System",null,500)

            }
        }
        else{
            return Response(res,"Unauthorized",null,401)
        }
    };
}
exports.Authenciation =(role)=>{
    return async (req,res,next)=>{
        try{
              const token = req.headers.authorization?.split(' ')[1];
                if(token){
                    const result = await tokenAuth.verifyToken(token);
                    if(role == ROLE.USER){
                        const user = await User.findById(result.id,'email inactive security_code full_name avatar');
                        if(user){
                            req.user = result.id
                            req.security_code = user.security_code
                            req.user_info = user
                            next()
                        }else{
                            return Response(res,"Unauthorized",null,401)
                        }
                    }
                    if(role == ROLE.PARTNER){
                        const partner = await Partner.findById(result.id,'image email privateKey description name webhook');
                        if(partner){
                            req.partner = partner
                            next()
                        }else{
                            return Response(res,"Unauthorized",null,401)
                        }
                    }
                }
                else{
                    return Response(res,"Unauthorized",null,401)
                }
        }catch(error){
            return Response(res,"Unauthorized",null,401)
        }
      
    }
},
exports.AuthPartner = catchError(async(req,res,next)=>{
    const token = req.headers.authorization?.split(' ')[1]
    if(!token){
        throw new AppError("Unauthorized",401)
    }
    const data = await Partner.findOne({privateKey:token})
    if(!data?.webhook){
        throw new AppError("Webhooks must be configured before taking action",402)
    }
    if(data){
        req.partner = data
        next()
    }
})
