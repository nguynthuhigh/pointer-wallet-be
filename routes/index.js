const routerAuth = require("./auth.routes");
const routeRole = require("./role.routes");
const routeCredit = require("./creditcard.routes");
const routeUser = require("./user.routes");
const routeWallet = require("./wallet.routes");
const routeTransaction = require("./transaction.routes");
const routeAuthPartner = require("./auth.partner.routes");
const routePartner = require("./partner.routes");
const routePayment = require("./payment.routes");
const routeVoucher = require("./voucher.routes");
const routeWebhook = require("./webhook.routes")


module.exports = (app)=>{
    app.use("/api/v1/user", routerAuth);
    app.use("/api/v1/role", routeRole);
    app.use("/api/v1/card", routeCredit);
    app.use("/api/v1/user", routeUser);
    app.use("/api/v1/wallet", routeWallet);
    app.use("/api/v1/transaction", routeTransaction);
    app.use("/api/v1/partner", routeAuthPartner);
    app.use("/api/v1/partner", routePartner);
    app.use("/api/v1/voucher", routeVoucher);
    app.use("/api/v1/webhook",routeWebhook)
    app.use("",routePayment)
    app.get('/test',(req,res)=>{
        res.status(200).json({message:"Hello-world"})
      })
    app.post('/hello-world',(req,res)=>{
      res.status(200).json({message:req.body})
    })
}