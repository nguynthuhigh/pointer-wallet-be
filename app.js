require("dotenv").config();
require('./cron')
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());
//ejs
app.set('view engine', 'ejs');
//bodyParser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
require('./routes/index')(app)

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    return app.listen({ port: process.env.PORT }, () => {
      // const db = mongoose.connection;
      // const server = http.createServer(app);
      // socketHandle(server,db)
      console.log("Connected MongoDB");
      console.log("http://localhost:" + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
