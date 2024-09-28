const { set, get, del } = require("../helpers/redis.helpers");
const { Response } = require("../utils/response");
const catchError = require("./catchError.middleware");
module.exports = {
  ///cache with url
  cache: catchError(async (req, res, next) => {
    const data = await get(`${req.originalUrl}/${req.user}`);
    if (data) {
      return res.status(200).json(data);
    }
    const originalJson = res.json.bind(res);
    res.json = async (body) => {
      await set(`${req.originalUrl}/${req.user}`, body, 600);
      return originalJson(body);
    };
    next();
  }),
};
