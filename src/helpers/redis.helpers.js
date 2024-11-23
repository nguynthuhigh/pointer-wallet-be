const { getRedisClient } = require("../configs/redis/redis");
const set = async (key, value, expire) => {
  const redis = getRedisClient();
  await redis.set(key, JSON.stringify(value));
  if (expire) {
    await redis.expire(key, expire);
  }
  return true;
};
const get = async (key) => {
  const redis = getRedisClient();
  return JSON.parse(await redis.get(key));
};
const del = async (key) => {
  const redis = getRedisClient();
  return await redis.del(key);
};
const expire = async (key, expire) => {
  const redis = getRedisClient();
  return await redis.expire(key, expire);
};
const incr = async (key, expire) => {
  const redis = getRedisClient();
  const value = await redis.incr(key);
  if (expire) {
    await redis.expire(key, expire);
  }
  return value;
};
module.exports = {
  set,
  get,
  expire,
  del,
  incr,
};
