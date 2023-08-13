const crypto = require('crypto');
const {Config} = require('../utils');
const PaystackWebhook = (req, res, next) => {
  const payload = req.body;

  const signature = req.headers['x-paystack-signature'];
  const expectedSignature = crypto
    .createHmac('sha512', Config.paystackConfig.secretKey)
    .update(JSON.stringify(payload))
    .digest('hex');

  if (expectedSignature == signature) { 
    next();
    return;
  }
  res.sendStatus(400);
};

exports.PaystackWebhook = PaystackWebhook;
