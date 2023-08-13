const amqp = require('amqplib/callback_api');
const {
  Config
} = require('../utils');

const rabbitmq_url = Config.rabbitMqConnectionURL


let ch = null;
amqp.connect(rabbitmq_url, function (err, conn) {
    conn.createChannel(function (err, channel) {
        ch = channel;
    });
});

exports.publishToQueue = async (queueName, data) => {
  return await ch.sendToQueue(queueName, Buffer.from(data), {persistent: true});
}

process.on('exit', (code) => {
  ch.close();
  console.log(`Closing rabbitmq channel`);
}); 