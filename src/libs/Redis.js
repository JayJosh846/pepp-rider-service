require('dotenv').config();
const {createClient} = require('redis');
const util = require('util');
const { Config } = require('../utils');
const { Logger } = require('./');

const redisClient = createClient({
        url: Config.redisConfig.url
  });

try {
  redisClient.getAsync = util.promisify(redisClient.get).bind(redisClient);
  redisClient.setexAsync = util.promisify(redisClient.setex).bind(redisClient);
  redisClient.clear = util.promisify(redisClient.del).bind(redisClient);
} catch (err) {
    console.log ('redis error', err);
}

redisClient.on('connect', async () => {
    console.log (
        `Redis database connected! on ${Config.redisConfig.host}: ${Config.redisConfig.port}`,
  );
}); 

redisClient.on('error', (error) => {
    console.log (
        'Error initialising Redis database', error.message
      );
});




module.exports = {
  redisClient
};
