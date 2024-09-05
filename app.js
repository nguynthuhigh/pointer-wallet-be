require("dotenv").config();
require('./cron')
const express = require("express");
const app = express();
const {connectMongoDB} = require('./configs/mongodb/mongodb')
const {connectRedis} = require('./configs/redis/redis')
// Helmet 
const helmet = require('helmet')
app.use(helmet())
// Compression
const compression = require('compression')
app.use(compression())
//Cookie
const cookieParser = require('cookie-parser')
app.use(cookieParser())
//Config cors
const cors = require("cors");
app.use(cors({
  origin:['http://192.168.1.218:3000','https://pointer.io.vn','https://wallet.pointer.io.vn','http://localhost:5173','https://presspay-wallet.vercel.app','http://localhost:3000','https://presspay.vercel.app'],
  credentials: true
}));
//bodyParser
const bodyParser = require("body-parser");
const handleErrorMiddleware = require("./middlewares/handleError.middleware");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Routes
require('./routes/index')(app)
//Connect to MongoDB
connectMongoDB()
//Connect to Redis
connectRedis()
app.use(handleErrorMiddleware)
app.listen({ port: process.env.PORT }, () => {
  console.log("http://localhost:" + process.env.PORT);
});
