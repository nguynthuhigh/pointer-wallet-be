const {registerSchema} = require("../validates/user.validate")
const {voucherSchema} = require("../validates/voucher.validate")
const {paymentSchema} = require("../validates/payment.validate");
const catchError = require("./catchError.middleware");
const { sendMoney, depositMoney } = require("../validates/wallet.validate");
module.exports ={
    validateRegister :catchError( async (req, res, next) => {
        await registerSchema.validate(req.body);
        next();
    }),
    validateAddVoucher:async(req, res, next)=>{
        try {
            await voucherSchema.validate(req.body);
            next();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    validatePayment:async(req,res,next)=>{
        try {
            await paymentSchema.validate(req.body);
            next();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    validateDepositMoney:catchError(async(req,res,next)=>{
        await depositMoney.validate(req.body)
        next()
    }),
    validate: (schema)=>  catchError( async (req,res,next)=>{
        await schema.validate(req.body)
        next()
    })
}
