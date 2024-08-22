const jwt = require('jsonwebtoken');
const AppError = require('../helpers/handleError');
module.exports = {
    createToken:(id)=>{
        const accessToken =  jwt.sign({id:id},process.env.SECRET_TOKEN,
            {
                algorithm:'HS256',
                expiresIn:'30m'
            }
        )
        const refreshToken =  jwt.sign({id:id},process.env.SECRET_TOKEN,
            {
                algorithm:'HS256',
                expiresIn:'14 days'
            }
        )
        return {accessToken,refreshToken}
    },
    verifyToken:(token)=>{
        try {
            return jwt.verify(token, process.env.SECRET_TOKEN)
        } catch (error) {
            throw new AppError("Unauthorized",401)
        }
    }
}
