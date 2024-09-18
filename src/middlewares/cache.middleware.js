const {set, get, del} = require('../helpers/redis.helpers')
const {Response} = require('../utils/response')
const catchError = require('./catchError.middleware')
module.exports = {
    cache:(key,sub_key)=> catchError(async(req,res,next)=>{
        const data = await get(`${key}:${req.user}`)
        if(data){
            return Response(res,'Success',JSON.parse(data),200)
        }
        else{
            const originalJson = res.json.bind(res);
            res.json =async (body)=>{
                await set(`user:${req.user}`,JSON.stringify(body),600)
                return originalJson(body)
            }
            next()
        }
    })
}