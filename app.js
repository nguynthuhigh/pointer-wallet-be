require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const cors = require("cors");
app.use(cors());
//routes
const routerAuth = require("./routes/auth.routes");
const routeRole = require("./routes/role.routes");
const routeCredit = require("./routes/creditcard.routes");
const routeUser = require("./routes/user.routes");
const routeWallet = require("./routes/wallet.routes");
const routeTransaction = require("./routes/transaction.routes");
const routeAuthPartner = require("./routes/auth.partner.routes");
const routePartner = require("./routes/partner.routes");


//bodyParser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/v1/user", routerAuth);
app.use("/api/v1/role", routeRole);
app.use("/api/v1/card", routeCredit);
app.use("/api/v1/user", routeUser);
app.use("/api/v1/wallet", routeWallet);
app.use("/api/v1/transaction", routeTransaction);
app.use("/api/v1/partner", routeAuthPartner);
app.use("/api/v1/partner", routePartner);

app.get('/test',(req,res)=>{
  res.send("<h1>Hello World</h1>")
})
mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    return app.listen({ port: process.env.PORT }, () => {
      console.log("Connected MongoDB");
      console.log("http://localhost:" + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
