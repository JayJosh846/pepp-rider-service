const ethers = require("ethers");
const crypto = require("crypto")
const sha256 = require('simple-sha256')
const Wallet = ethers.Wallet;
const AwsUploadService = require("./AWSService");
const Axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const { Config } = require("../utils/");

const WEB3_BASE_URL = Config.WEB3_BASE_URL;

class BlockchainService {

   network = "bantu";

   async createAccount(email) {
        const data = {
      email,
    };
    let resp;
    
    await Axios.post(`${WEB3_BASE_URL}web3/user/register/${this.network}`, data)
      .then((result) => {

        resp = result.data;
      })
      .catch((error) => {
        console.log("web3-create-acount", error.message);
      });
    return resp;
  };


   async mint(email, amount) {
    const data = {
      email,
      amount
    };
    let resp;
    await Axios.post(`${WEB3_BASE_URL}web3/txn/mint/${this.network}`, data)
      .then((result) => {
        resp = result.data;
      })
      .catch((error) => {
        console.log("web3-mint", error.message);
      });
    return resp;
  };

   async transfer(email, amount, receiver) {
    const data = {
      email,
      amount,
      receiver,
    };
    let resp;
    await Axios.post(`${WEB3_BASE_URL}web3/txn/transfer/${this.network}`, data)
      .then((result) => {
        resp = result.data;
      })
      .catch((error) => {
        console.log("web3-transfer", error.message);
      });
    return resp;
  };

   async burn(email, amount) {
    const data = {
      email,
      amount,
    };
    let resp;
    await Axios.post(`${WEB3_BASE_URL}web3/txn/burn/${this.network}`, data)
      .then((result) => {
        resp = result.data;
      })
      .catch((error) => {
        console.log("web3-burn", error.message);
      });
    return resp;
  };

   async balance(email) {
    const data = {
      email
    };
    let resp;
    await Axios.get(`${WEB3_BASE_URL}web3/account/balance/${email}/${this.network}`, data)
      .then((result) => {
        resp = result.data;
      })
      .catch((error) => {
        console.log("web3-balance", error.message);
      });
    return resp;
  };

}

module.exports = new BlockchainService();

