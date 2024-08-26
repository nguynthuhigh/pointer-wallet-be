const jwt = require('jsonwebtoken');
const AppError = require('../helpers/handleError');
module.exports = {
    createToken:(id)=>{
        const payload = {
            id:id
        }
        const accessToken =  jwt.sign(payload,process.env.SECRET_TOKEN,
            {
                algorithm:'HS256',
                expiresIn:'30s'
            }
        )
        const refreshToken =  jwt.sign(payload,process.env.SECRET_TOKEN,
            {
                algorithm:'HS256',
                expiresIn:'14d'
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
