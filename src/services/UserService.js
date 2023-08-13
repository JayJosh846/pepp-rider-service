const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()



class UserService {
    
    static async addUser(newUser) {
        return await prisma.rider.create({ data: newUser }); 
    }

    static async findUser(id) {
        return await prisma.rider.findUnique(
            { 
                where: { 
                    id  
                }})
    }

    static async findUserByPhone(id) {
        return await prisma.rider.findUnique(
            { 
                where: { 
                    mobile: id  
                }})
    }

    static async findUserByEmail(id) {
        return await prisma.rider.findUnique(
            { 
                where: { 
                    email: id 
                }})
    }

    static async updateUser(id, data) {
        return await prisma.driver.update({
            where: {
                id
            },
            data
        })
    }
    
    static async updateUserByPhone(id, data) {
        return await prisma.rider.update({ 
            where: { 
                mobile: id 
            }, 
              data
            })
    }

    static async updateUserByEmail(id, data) {
        return await prisma.rider.update({
            where: {
                email: id
            },
            data
        })
    }
}

module.exports = UserService;
