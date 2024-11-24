// const jwt = require("jsonwebtoken");
// const CheckToken = (req, res, next) => {
//   if (req.url === "/sign-in-admin") {
//     return next();
//   }
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       res.status(401).json({
//         message: "Authorization header is missing",
//       });
//     }

//     const accessToken = authHeader.split(" ")[1];
//     if (!accessToken) {
//       res.status(401).json({
//         message: "Token is missing",
//       });
//     }
    
//     const jwtObject = jwt.verify(accessToken, process.env.JWT_SECRET);
//     const isExpired = Date.now() >= jwtObject.exp * 1000;
//     if (isExpired) {
//       res.status(401).json({
//         message: "Token is expired",
//       });
//     }
//     return next();
//   } catch (error) {
//     res.status(401).json({
//       message: "Invalid or expired token"
//     });
//   }
// };

// module.exports = {
//   CheckToken
// };
