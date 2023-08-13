// const {FundAccount, Wallet} = require('../models');
// const QueueService = require('./QueueService');
// const {Logger} = require('../libs');
// const BlockchainService = require('./BlockchainService');
const { PrismaClient } = require('@prisma/client');
const WalletService = require('./WalletService');
const UserService = require('./UserService');
const BlockchainService = require('./BlockchainService');
const TransactionService = require('./TransactionService');
const prisma = new PrismaClient()

class WebhookService {
  static async verifyPaystackDeposit(verifiedData) {
    if (verifiedData.event === 'charge.success') {
       const transactionReference =  verifiedData.data.reference;
       const wallet = await prisma.fundWallet.findUnique({
        where: {
            transRef: transactionReference
        }})
        const findWallet = await WalletService.findRiderWallet(wallet.riderId);
        const rider = await UserService.findUser(wallet.riderId);
        await BlockchainService.mint( rider.email, wallet.amount);
        const transactionData = {
            reference: transactionReference,
            description: 'Wallet Funded',
            amount: wallet.amount,
            type: 'DEPOSIT',
            status: 'COMPLETE',
            riderId: wallet.riderId,
        }

        
        const deposited = findWallet.deposited || 0;
        const transaction = findWallet.noOfTrans || 0;
        const newDepositAmount = (verifiedData.data.amount / 100) + deposited;
        const noOfTransactions = transaction + 1;
        
        await TransactionService.createTransaction(transactionData);
        const walletBalance = await BlockchainService.balance(rider.email);
        await WalletService.updateWallet(wallet.riderId, {
            walletBalance: walletBalance.Balance,
            deposited: newDepositAmount,
            noOfTrans: noOfTransactions,
        });
        return wallet;
    }
    return null;
  }
}

module.exports = WebhookService;
