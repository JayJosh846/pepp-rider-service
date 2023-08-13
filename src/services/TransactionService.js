const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


class TransactionService {
    
    static async createTransaction(newTransaction) {
        return await prisma.transactions.create({ data: newTransaction }); 
    }
}


module.exports = TransactionService;
