const {
    Config,
    generateFIATRef
    } = require('../utils');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const {Logger} = require('../libs');
const paystack = require('paystack-api')(Config.paystackConfig.secretKey);


class FiatService {
    
  static async buildDepositData(user, _amount) {
    const amount = _amount * 100;
    const currency = Config.paystackConfig.defaultCurrency;
    const ref = generateFIATRef();

    const init = await paystack.transaction.initialize({
    reference: ref,
    amount,
    email: user.email
    })

    await prisma.fundWallet.create({
        data:{
            channel: 'fiat',
            service: 'paystack',
            riderId: user.id,
            amount: _amount,
            transRef: ref
        }
    })

    return {
      ref,
      email: user.email,
      key: Config.paystackConfig.publickKey,
      channels: Config.paystackConfig.channels,
      currency,
      amount,
      metadata: {
        authorization_url: init.data.authorization_url,
        user_id: user.id
      },
    };
  }

  static async verifyDeposit(reference) {
    // return new Promise(async (resolve, reject) => {
      try {
        const { riderId, transRef } = await prisma.fundWallet.findUnique({
            where: { 
                transRef: reference  
            }})
            console.log("paystack", paystack.transaction);
        const data = await paystack.transaction.verify(JSON.parse(transRef));
        // resolve({
            return  {data,
            riderId
            }
        // });
      } catch (error) {
        return error;
      }
    // });
  }

  static async withdraw(source, amount, recipient, reason) {
    return new Promise(async (resolve, reject) => {
      try {
        let value = amount * 100;
        Logger.info(`Transferring Funds to Bank Account`);
        const response = await paystack.transfer.create({
          source,
          amount: value,
          recipient,
          reason
        });
        Logger.info(`Funds Transferred to Bank Account`);
        resolve(response);
      } catch (error) {
        Logger.error(`Error Transferring Funds to Bank account: ${error}`);
        reject(error);
      }
    });
  }

  static async resolveAccount(account_number, bank_code) {
    return new Promise(async (resolve, reject) => {
      try {
        const resoponse = await paystack.verification.resolveAccount({
          account_number,
          bank_code
        });
        if (!resoponse.status) throw new Error('Request failed.');
        resolve(resoponse.data);
      } catch (error) {
        reject(new Error('Could not resolve account. Check details.'));
      }
    });
  }

  static async listBanks(query = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await paystack.misc.list_banks(query);
        const banks = response.data.map(bank => ({
          name: bank.name,
          country: bank.country,
          currency: bank.currency,
          code: bank.code
        }));
        resolve(banks);
      } catch (error) {
        reject(error);
      }
    });
  }

  static async createRecipientReference(name, account_number, bank_code) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await paystack.transfer_recipient.create({
          type: 'nuban',
          name,
          account_number,
          bank_code
        });
        if (!response.status) throw new Error('Request failed.');
        resolve(response.data);
      } catch (error) {
        reject(new Error('Recipient creation failed.'));
      }
    });
  }
}

module.exports = FiatService;
