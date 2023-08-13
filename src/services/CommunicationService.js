const amqp = require('amqplib/callback_api');
const {
    TripService, 
    IPandLocationService
} = require('../services');
const {
    Config
} = require('../utils');
const { QUEUE } = require('../utils/constants');


const rabbitmq_url = Config.rabbitMqConnectionURL


const updateTrip = async (ride) => {
    const data = JSON.parse(ride);
    const tripUpdate = await TripService.updateTrip(
        data.id, {
        driverId: data.driverId,
    })
    console.log("trip Update", tripUpdate);
}

const startTripStatus = async (ride) => {
    const data = JSON.parse(ride);
    const tripUpdate = await TripService.updateTrip(
        data.id, {
        status: data.status,
    })

    console.log("trip start", tripUpdate);

}


amqp.connect(rabbitmq_url, function (err, conn) {
    conn.createChannel(function (err, ch) {
        ch.consume(QUEUE.DRIVER_RESPONSE, function (msg) {
            console.log('.. Ride worker ...');
            setTimeout(() => {
                console.log("Message:", JSON.parse(msg.content));
                updateTrip(msg.content);
                ch.ack(msg);
            }, 4000);
        }, { noAck: false }
        );
    });
})


amqp.connect(rabbitmq_url, function (err, conn) {
    conn.createChannel(function (err, ch) {
        ch.consume(QUEUE.START_TRIP, function (msg) {
            console.log('.. Ride worker ...');
            setTimeout(() => {
                console.log("Message:", JSON.parse(msg.content));
                startTripStatus(msg.content);
                ch.ack(msg);
            }, 4000);
        }, { noAck: false }
        );
    });
})

 