const express = require("express");
const router = express.Router();
const { PaystackWebhook } = require("../middleware/paystackWebhook")
const { WebhookController } = require("../controllers")

router.post(
    '/paystack/deposit',
    PaystackWebhook,
    WebhookController.verifyPaystackDeposit
    );


module.exports = router;
