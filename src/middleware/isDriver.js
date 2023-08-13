const { Response } = require('../libs');
const { HttpStatusCode, AclRoles } = require('../utils');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { Logger } = require('../libs');
const axios = require("axios");
const {
    TripService,
    IPandLocationService,
} = require('../services');


const isDriver = async (req, res, next) => {
    try {
        const driver = req.user;
        const riderId =
            req.body.riderId ||
            req.params.riderId ||
            req.query.riderId;

        if (!riderId.trim()) {
            Response.setError(
                HttpStatusCode.STATUS_BAD_REQUEST,
                'Rider ID is missing.'
            );
            return Response.send(res);
        }
        const riderTrip = await TripService.findRidertrip(parseInt(riderId));
        const drivers = await IPandLocationService.getAllAvailableDriverLocations({
            latitude: riderTrip.latitude,
            longitude: riderTrip.longitude
        })
        const exists = drivers.some(
            found => found.driverId === driver.id
        );
        if (!exists) {
            Response.setError(
                HttpStatusCode.STATUS_RESOURCE_NOT_FOUND,
                "Driver is not in rider's location"
            );
            return Response.send(res);
        }

        let driverIds = drivers.map(a => a.driverId);
        req.drivers = driverIds;
        next();
    } catch (err) {
        Response.setError(
            HttpStatusCode.STATUS_INTERNAL_SERVER_ERROR,
            'Server error. Please contact support.'
          );
          return Response.send(res);
    }
}

exports.isDriver = isDriver;






