const {registerSchema} = require("../validates/user.validate")
const {voucherSchema} = require("../validates/voucher.validate")
module.exports ={
    validateRegister : async (req, res, next) => {
        try {
            await registerSchema.validate(req.body);
            next();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    validateAddVoucher:async(req, res, next)=>{
        try {
            await voucherSchema.validate(req.body);
            next();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
