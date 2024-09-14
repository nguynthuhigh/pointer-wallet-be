const {getRedisClient} = require('../configs/redis/redis')


const set =async (key,value,expire)=>{
    const redis = getRedisClient()
    try {
        await redis.set(key,value)
        if(expire){
            await redis.expire(key,expire)
        }
        return true
    } catch (error) {
        console.log(error)
        throw error
    }
}
const get = async (key)=>{
    const redis = getRedisClient()
    try {
        return await redis.get(key)
    } catch (error) {
        console.log(error)
        throw error
    }
}
const del = async (key)=>{
    const redis = getRedisClient()
    try {
        return await redis.del(key)
    } catch (error) {
        console.log(error)
        throw error
    }
}
const expire = async (key,expire)=>{
    const redis = getRedisClient()
    try {
        return await redis.expire(key,expire)
    } catch (error) {
        console.log(error)
        throw error
    }
}
const feat = {
    set,
    get,
    expire,
    del
}
module.exports = feat