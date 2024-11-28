const checkApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || process.env.API_KEY !== apiKey) {
    return res.status(401).json({
      message: "API key is missing",
      status: 401,
    });
  }
  next();
};

module.exports = checkApiKey;
