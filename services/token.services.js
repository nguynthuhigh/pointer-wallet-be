const token = require('../utils/token')
const Key = require('../models/keys.model')
const AppError = require('../helpers/handleError')
module.exports = {
    createTokenPair : async(userID)=>{
        const {accessToken,refreshToken} = token.createToken(userID)
        const data = await Key.create({
            refresh_token:refreshToken,
            userID:userID
        })
        if(!data){
            throw new AppError("Error create token",404)
        }
        return {accessToken,refreshToken}
    },
    findRefreshToken: async(refreshToken)=>{
        if(!refreshToken){
            throw new AppError("Unauthorized",401)
        }

        const token = await Key.findOne({refresh_token:refreshToken})
        if(!token){
            throw new AppError("Not found refresh token",401)
        }
        return token
    },
    updateRefreshToken:async(refreshTokenOld, refreshTokenNew)=>{
        const token = await Key.updateOne({refresh_token:refreshTokenOld},{refresh_token:refreshTokenNew})
        if(token.modifiedCount === 0){
            throw new AppError("Fail refresh token",400)
        }
    },
    deleteRefreshToken:async(refreshToken)=>{
        const token = await Key.deleteOne({refresh_token:refreshToken})
        if(token.deletedCount === 0){
            throw new AppError("Fail log out, try again",400)
        }
    }
}
