const routerAuth = require("./user/auth.routes");
const routeCredit = require("./user/creditcard.routes");
const routeUser = require("./admin/user.routes");
const routeWallet = require("./user/wallet.routes");
const routeTransaction = require("./user/transaction.routes");
const routeAuthPartner = require("./partner/auth.partner.routes");
const routePartner = require("./partner/partner.routes");
const routePayment = require("./payment/payment.routes");
const routeVoucher = require("./payment/voucher.routes");
const routeWebhook = require("./partner/webhook.routes")
const routeAdmin = require("./admin/admin.routes")
const routePartnerManagement = require('./admin/partner_management.routes')
module.exports = (app)=>{
    app.use("/api/v1/user", routerAuth);
    app.use("/api/v1/card", routeCredit);
    app.use("/api/v1/user", routeUser);
    app.use("/api/v1/wallet", routeWallet);
    app.use("/api/v1/transaction", routeTransaction);
    app.use("/api/v1/partner", routeAuthPartner);
    app.use("/api/v1/partner", routePartner);
    app.use("/api/v1/voucher", routeVoucher);
    app.use("/api/v1/webhook",routeWebhook)
    app.use("/api/v1/admin",routeAdmin)
    app.use("/api/v1/partner-management",routePartnerManagement)
    app.use("",routePayment)
    app.get('/test',(req,res)=>{
        res.status(200).json({message:"Hello-world"})
      })
    app.post('/hello-world',(req,res)=>{
      res.status(200).json({message:req.body})
    })
}