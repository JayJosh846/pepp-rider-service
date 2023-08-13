const {
    Config,
} = require('../utils');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { Logger } = require('../libs');
const axios = require("axios");
const { get } = require('https');



class IPandLocationService {

    static async addLocation(newLocation) {
        return await prisma.location.create({
            data: newLocation 
        });
    }

    static async findRiderLocation(id) {
        return await prisma.location.findUnique(
            { 
                where: { 
                    riderId: id
                }})
    }

    static async updateRiderLocation(id, data) {
        return await prisma.location.update({
            where: { 
                riderId: id
            },
            data 
        })
    }

    static async determineLocationByIP() {
        const publicIP = await this.getPublicIpAddress();
        const response = await axios.get(`https://ipapi.co/${publicIP}/json`);
        return response.data;

    }

    static async getPublicIpAddress() {
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
            return response.data.ip;
        } catch (error) {
            console.error('Error fetching public IP address:', error);
            return null;
        }
    }

    static async getAllAvailableDriverLocations(location) {
        const drivers = await prisma.location.findMany({
            where: { 
                available: true 
            }, 
          });  
          // Filter the list of drivers by location and availability
        const availableDrivers = drivers.filter(driver => {
        const { latitude, longitude } = driver;
        const driverLocation = { latitude, longitude };
        const distance = this.getDistance(location, driverLocation); // Use a distance calculation function to determine the distance between the rider's location and the driver's location
        const maxDistance = 10; // Set a maximum distance for available drivers (e.g. 10 km)
        return distance <= maxDistance && driver.available;
        });

        return availableDrivers;
    }

    static getDistance(point1, point2) {
        const { latitude: latitude1, longitude: longitude1 } = point1;
        const { latitude: latitude2, longitude: longitude2 } = point2;
        const R = 6371e3; // Earth's radius in meters
        const φ1 = (latitude1 * Math.PI) / 180; // Convert latitude1 to radians
        const φ2 = (latitude2 * Math.PI) / 180; // Convert latitude2 to radians
        const Δφ = ((latitude2 - latitude1) * Math.PI) / 180; // Convert Δlat to radians
        const Δλ = ((longitude2 - longitude1) * Math.PI) / 180; // Convert Δlng to radians
        const a =
          Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in meters
        return d / 1000; // Convert distance to kilometers
      }

    


}

module.exports = IPandLocationService;
