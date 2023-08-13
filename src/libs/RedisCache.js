const { redisClient } = require("./Redis");

class Rediscache {

static async setCacheWithExpiration (itemKey, exp, data) {
  return await redisClient.setexAsync(itemKey, exp, data);
};

static async getCachedItem(itemKey) {
  return await redisClient.getAsync(itemKey);
};

static async clearCacheItem (itemKey) {
  return await redisClient.clear(itemKey);
};

}


module.exports = Rediscache;