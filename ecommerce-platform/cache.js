require("dotenv").config();
const redis = require("redis");

const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

(async () => {
  redisClient.on("error", (err) => console.error("Redis client error", err));
  redisClient.on("ready", () => console.log("Redis client started!"));

  await redisClient.connect();
  await redisClient.ping();
})();

module.exports = redisClient;
