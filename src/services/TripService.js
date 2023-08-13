const {
    Config,
} = require('../utils');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { Logger } = require('../libs');
const axios = require("axios");
const { get } = require('https');


class TripService {

    static async addTrip(newTrip) {
        return await prisma.trips.create({
            data: newTrip 
        });
    }

    static async findTrip(id) {
        return await prisma.trips.findUnique(
            { 
                where: { 
                    id
                }})
    }

    static async findRidertrip(id) {
        const trip = await prisma.trips.findMany(
            { 
                where: { 
                    riderId: id
                }})

            let result = trip.map(a => a);
            return result.find(element => element);
    }

    static async updateTrip(id, data) {
        return await prisma.trips.update({
            where: {
                id
            },
            data
        })
    }
}

module.exports = TripService;
