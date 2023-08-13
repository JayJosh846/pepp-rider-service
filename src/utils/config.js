require('dotenv').config();

exports.Config = {
  WEB3_BASE_URL:
    process.env.NODE_ENV == 'production'
      ? process.env.WEB3_BASE_URL
      : process.env.WEB3_BASE_URL_TEST,

      
  mailConfig: {
    host: process.env.MAIL_HOST || '',
    port: process.env.MAIL_PORT || '',
    user: process.env.MAIL_USERNAME || '',
    pass: process.env.MAIL_PASSWORD || '',
    from: process.env.MAIL_SENDER || ''
  },

  redisConfig: { 
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_URL,
    auth_pass: process.env.REDIS_PASSWORD,
    url: process.env.REDISCLOUD_URL
  },

  termiiConfig: {
    baseUrl: process.env.TERMII_BASE_URL,
    from: process.env.TERMII_SMS_FROM,
    api_key: process.env.TERMII_API_KEY,
    api_secret: process.env.TERMII_API_SECRET
  },

  paystackConfig: {
    secretKey: process.env.PAYSTACK_SEC_KEY || "",
    publickKey: process.env.PAYSTACK_PUB_KEY || "",
    channels: ['card', 'bank', 'ussd', 'qr', 'bank_transfer'],
    defaultCurrency: 'NGN',
    currencies: ['NGN']
  },

  rabbitMqConnectionURL: process.env.RABBITMQ_URL,



}
