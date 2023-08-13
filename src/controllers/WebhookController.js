const { HttpStatusCode } = require('../utils');
const { Logger } = require('../libs');
const { WebhookService, BlockchainService } = require('../services');
const { Response } = require('../libs');


class WebhookController {
    static async verifyPaystackDeposit(req, res) {
        try {
            await WebhookService.verifyPaystackDeposit(req.body);
            res.sendStatus(HttpStatusCode.STATUS_OK);
            Logger.info(`Rider PayStack Deposit Verified`);
        } catch (err) {
            console.log(err);
            Logger.error(`Error Verifying Organisation PayStack Deposit: ${err}`);
            res.sendStatus(HttpStatusCode.STATUS_BAD_REQUEST);
        }
    }

}


module.exports = WebhookController;
