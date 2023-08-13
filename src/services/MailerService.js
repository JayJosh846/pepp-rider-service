const nodemailer = require('nodemailer');
const { Config } = require('../utils');

class MailerService {
  config = {};
  transporter;
  constructor() {
    this.config = Config.mailConfig;
    this.transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      auth: {
        user: this.config.user,
        pass: this.config.pass
      },
      secure: true,
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
      }
    });
  }

  _sendMail(to, subject, html) {
    const options = {
      from: this.config.from,
      to,
      subject,
      html
    };
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(options, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  }
//   verify(to, name, password, vendor_id) {
//     return new Promise((resolve, reject) => {
//       this.transporter.verify((err, success) => {
//         if (!err) {
//           console.log('Server is ready to take our messages');
//           this.sendPassword(to, name, password, vendor_id);
//           resolve(success);
//         } else {
//           console.log('Not verified', err);
//           reject(err);
//         }
//       });
//     });
//   }
//   verifyToken(smsToken, to, name) {
//     return new Promise((resolve, reject) => {
//       this.transporter.verify((err, success) => {
//         if (!err) {
//           console.log('Server is ready to take our messages');
//           this.sendSMSToken(smsToken, to, name);
//           resolve(success);
//         } else {
//           console.log('Not verified', err);
//           reject(err);
//         }
//       });
//     });
//   }

//   sendPassword(to, name, password, vendor_id) {
//     const body = `
//     <div>
//       <p>Hi, ${name}\nYour CHATS account ${
//       vendor_id
//         ? 'ID is: ' + vendor_id + ', password is: ' + password
//         : 'password is: ' + password
//     }</p>
//       <p>Best,\nCHATS - Convexity</p>
//     </div>
//     `;
//     const options = {
//       from: this.config.from,
//       to,
//       subject: 'Account Credentials',
//       html: body
//     };

//     return new Promise((resolve, reject) => {
//       this.transporter.sendMail(options, (err, data) => {
//         if (!err) {
//           console.log('sent');
//           resolve(data);
//         } else {
//           reject(err);
//         }
//       });
//     });
//   }


  sendOTP(otp, ref, to, name) {
    const body = `
    <div>
      <p>Hello ${name},</p>
      <p>Your PEPP OTP is: ${otp} and REF is ${ref}</p>
      <p>PEPP - Pepp Technologies</p>
    </div>
    `;
    const options = {
      from: this.config.from,
      to,
      subject: 'Email Verification Token',
      html: body
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(options, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  }


  sendAdminSmsCreditMail(to, amount) {
    const body = `
    <div>
      <p>Hello Admin,</p>
      <p>This is to inform you that your SMS service balance is running low. Current balance is ${amount}. Please recharge your account.</p>
      <p>CHATS - Convexity</p>
    </div>
    `;
    const options = {
      from: this.config.from,
      to: [to, 'charles@withconvexity.com'],
      subject: 'Recharge Your Wallet Balance',
      html: body
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(options, (err, data) => {
        if (!err) {
          console.log('sent');
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  }

  sendAdminNinCreditMail(to, amount) {
    const body = `
    <div>
      <p>Hello Admin,</p>
      <p>This is to inform you that your NIN service balance is running low. Current balance is ${amount}. Please recharge your account</p>
      <p>CHATS - Convexity</p>
    </div>
    `;
    const options = {
      from: this.config.from,
      to: [to, 'charles@withconvexity.com'],
      subject: 'Recharge Your Wallet Balance',
      html: body
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(options, (err, data) => {
        if (!err) {
          console.log('sent');
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  }

  sendAdminBlockchainCreditMail(to, amount) {
    const body = `
    <div>
      <p>Hello Admin,</p>
      <p>This is to inform you that your Blockchain service balance that covers for gas is running low. Current balance is ${amount}. Please recharge your account</p>
      <p>CHATS - Convexity</p>
    </div>
    `;
    const options = {
      from: this.config.from,
      to: [to, 'charles@withconvexity.com'],
      subject: 'Recharge Your Wallet Balance',
      html: body
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(options, (err, data) => {
        if (!err) {
          console.log('sent');
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
  }
}

module.exports = new MailerService();
