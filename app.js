require("dotenv").config();
require('./cron')

const express = require("express");
const app = express();
const {connectMongoDB} = require('./configs/mongodb/mongodb')
const {connectRedis} = require('./configs/redis/redis')
//Config cors
const cors = require("cors");
app.use(cors());
//bodyParser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Routes
require('./routes/index')(app)
//Connect to MongoDB
connectMongoDB()
//Connect to Redis
connectRedis()
app.listen({ port: process.env.PORT }, () => {
  console.log("http://localhost:" + process.env.PORT);
});
