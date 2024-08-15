// redis.js
const Redis = require('ioredis');

let redisClient;
const connectRedis = ()=> {
  redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  });

  redisClient.on('error', (err) => {
    console.error('Redis error:', err);
  });

  redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });
}

const getRedisClient = ()=> {
  if (!redisClient) {
    throw new Error('Redis client is not initialized. Call connectRedis first.');
  }
  return redisClient;
}



module.exports = {
  connectRedis,
  getRedisClient,
};
