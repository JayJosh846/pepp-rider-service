const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()



class WalletService {
    
    static async createWallet(newWallet) {
        return await prisma.wallets.create({
             data: newWallet 
            }); 
    }

    static async findRiderWallet(id) {
        return await prisma.wallets.findUnique(
            { 
                where: { 
                    riderId: id  
                }})
    }

    static async findDriverWallet(id) {
        return await prisma.wallets.findUnique(
            { 
                where: { 
                    driverId: id  
                }})
    }

    static async findTripWallet(id) {
        return await prisma.wallets.findUnique(
            { 
                where: { 
                    tripId: id  
                }})
    }

    static async updateWallet(id, data) {
        return await prisma.wallets.update({ 
            where: { 
                riderId: id 
            }, 
              data
            })
    }


}

module.exports = WalletService;