const {
    WalletService,
    FiatService,
    BlockchainService
  } = require('../services');

  const {Logger, Response} = require('../libs');
  const {HttpStatusCode, SanitizeObject} = require('../utils');
  const {logger} = require('../libs/Logger');

  class WalletController {

    static async fiatDeposit(req, res) {
        const rider = req.user;
        try {
          const data = SanitizeObject(req.body, ['amount']);
          const wallet = await WalletService.findRiderWallet(
            rider.id
          );
          if (!wallet) {
            Response.setError(
              HttpStatusCode.STATUS_RESOURCE_NOT_FOUND,
              'Rider wallet not found.'
            );
          }
          logger.info('Initiating payment');
          const fiatResponse = await FiatService.buildDepositData(
            rider,
            data.amount
          );

          if (!fiatResponse) {
            Response.setError(
              HttpStatusCode.STATUS_RESOURCE_NOT_FOUND,
              'Something went wrong. Please try again',
              fiatResponse
            );
          } 
          logger.info('Initiated payment');
          Response.setSuccess(
            HttpStatusCode.STATUS_CREATED,
            'Deposit data generated.',
            fiatResponse
          );
          return Response.send(res);
        } catch (error) {
          logger.error(`Error Initiating PayStack Transaction: ${error}`);
          Response.setError(
            HttpStatusCode.STATUS_INTERNAL_SERVER_ERROR,
            'Request failed. Please retry.'
          );
          return Response.send(res);
        }
      }

    static async verifyAndFund(req, res) {
        const { reference } = req.body;
        try {
            const verified = await FiatService.verifyDeposit(reference);

            console.log("verified", verified);
            // if (!verified.status) {
            //     Response.setError(
            //       HttpStatusCode.STATUS_RESOURCE_NOT_FOUND,
            //       'Failed to verify deposit. Please try again.'
            //     );
            //   }
              
            // await WalletService.findRiderWallet(verified.riderId);
        } catch (error) {
            logger.error(`Error Initiating PayStack Transaction: ${error}`);
            Response.setError(
              HttpStatusCode.STATUS_INTERNAL_SERVER_ERROR,
              'Request failed. Please retry.'
            );
            return Response.send(res);
          }
      }


  }

  module.exports = WalletController;
