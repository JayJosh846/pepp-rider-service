const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const {
    IPandLocationService,
    TripService,
    UserService,
    WalletService,
    BlockchainService
} = require('../services');
const {
    Response,
    Rediscache,
    publishToQueue } = require('../libs');
    const {logger} = require('../libs/Logger');

const {
    HttpStatusCode,
    createHash,
    generateAmount
} = require('../utils');

const { QUEUE } = require('../utils/constants');






class TripController {

    static async riderStartTrip(req, res, next) {
        const rider = req.user;
        const { pickUp, dropOff } = req.body;
        try {
            const {
                city,
                region,
                country,
                latitude,
                longitude,
            } = await IPandLocationService.determineLocationByIP();
            const location = { city, region, country, latitude, longitude };
            const riderFound = await IPandLocationService.findRiderLocation(
                rider.id
            )
            const riderBalance = await BlockchainService.balance(rider.email);
            if (riderBalance.Balance < generateAmount()) {
                Response.setError(
                    HttpStatusCode.STATUS_FORBIDDEN, 
                    'Account balance is insufficient for this trip.');
                  return Response.send(res);
            }
            if (riderFound === null) {
                const newLoc = await IPandLocationService.addLocation({
                    riderId: rider.id,
                    city: city,
                    region: region,
                    country: country,
                    latitude: latitude,
                    longitude: longitude,
                });

            } else {
                const updateLoc = await IPandLocationService.updateRiderLocation(
                    rider.id, {
                    city: city,
                    region: region,
                    country: country,
                    latitude: latitude,
                    longitude: longitude,
                })
            }
            const rideRequest = {
                pickUp: pickUp,
                dropOff: dropOff,
                riderId: rider.id,
                amount: generateAmount(),
                latitude: latitude,
                longitude: longitude,
            }
            const trip = await TripService.addTrip(rideRequest)
            logger.info('Trip initialised');


            // const queueResponse = await publishToQueue(
            //     QUEUE.RIDE_REQUEST, 
            //     JSON.stringify(rideRequest)
            //     ) 
            // console.log("queueResponse", queueResponse);                   

            Response.setSuccess(
                HttpStatusCode.STATUS_OK,
                'Location Updated',
                trip
            );
            return Response.send(res);
        } catch (err) {
            Response.setError(
                HttpStatusCode.STATUS_BAD,
                'Something went wrong. Please try again later');
        }
    }

    static async allAvailableDriverLocations(req, res) {
        const { riderId } = req.params;
        try {

            const riderTrip = await TripService.findRidertrip(parseInt(riderId));
            const drivers = await IPandLocationService.getAllAvailableDriverLocations({
                latitude: riderTrip.latitude,
                longitude: riderTrip.longitude
            })

            Response.setSuccess(
                HttpStatusCode.STATUS_OK,
                'Available Drivers',
                drivers);
            return Response.send(res);
        } catch (error) {
            Response.setError(
                HttpStatusCode.STATUS_INTERNAL_SERVER_ERROR,
                `Server Error: Please retry.`,
            );
            return Response.send(res);
        }
    }


}

module.exports = TripController;
