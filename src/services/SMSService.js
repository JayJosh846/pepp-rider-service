const {default: axios} = require("axios");
const { Config } = require("../utils")


class SMSService {

    httpService;
    constructor() {
      this.httpService = axios.create({
        baseURL: Config.termiiConfig.baseUrl
      });
    }

      async sendOTP (mobile) {
        const data = {
            api_key: Config.termiiConfig.api_key,
            message_type: "NUMERIC",
            to: mobile,
            from: Config.termiiConfig.from,
            channel: "dnd",
            pin_attempts: 3,
            pin_time_to_live: 5,
            pin_length: 6,
            pin_placeholder: "< 1234 >",
            message_text: "Your Pepp confirmation code is < 1234 >. Valid for 5 minutes, one-time use only",
            pin_type: "NUMERIC",
          };

          return new Promise(async (resolve, reject) => {
            try {
              const response = await this.httpService.post('/sms/otp/send', data);
              console.log('sms sent');
              resolve(response.data);
            } catch (error) {
              console.log('sms error' + error);
              reject(error);
            }
          });
    }


    async verifyOTP (pinId, pin) {
      const data = {
        api_key: Config.termiiConfig.api_key,
        pin_id: pinId,
        pin,
        };

        let termiiResult;

        await axios.request({
          url: '/sms/otp/verify',
          method: 'post',
          baseURL: Config.termiiConfig.baseUrl,
          data: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            'cache-control': 'no-cache'
          }
        })
          .then((result) => {
            termiiResult = result.data
          })
          .catch((error) => {
            termiiResult = error.response.data;
            console.log("***termii-verify-token", error.message);
          });
        return termiiResult;
  }
}

module.exports = new SMSService();
