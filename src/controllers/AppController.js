const { Response } = require('../libs');
const { HttpStatusCode } = require('../utils');
const { 
    SMSService,
    BlockchainService
 } = require('../services/');

class AppController {
  static async createAccount(req, res) {
    try {
      const { email } = req.body;
      const response = await BlockchainService.createAccount(email);
      Response.setSuccess(HttpStatusCode.STATUS_OK, response.message, response.data);
      return Response.send(res);
    } catch (error) {
      Response.setError(HttpStatusCode.STATUS_BAD_REQUEST, 'Account creation error', error);
      return Response.send(res);
    }
  }

  static async mint(req, res) {
    try {
      const { email, amount } = req.body;
      const response = await BlockchainService.mint(email, amount);
      Response.setSuccess(HttpStatusCode.STATUS_OK, 'Account minted successfully', response);
      return Response.send(res);
    } catch (error) {
      Response.setError(HttpStatusCode.STATUS_BAD_REQUEST, 'minting error', error);
      return Response.send(res);
    }
  }

  static async transfer(req, res) {
    try {
      const { email, amount, receiver } = req.body;
      const response = await BlockchainService.transfer(email, amount, receiver);
      Response.setSuccess(HttpStatusCode.STATUS_OK, 'Transfer operation successful', response);
      return Response.send(res);
    } catch (error) {
      Response.setError(HttpStatusCode.STATUS_BAD_REQUEST, 'transfer error', error);
      return Response.send(res);
    }
  }

  static async burn(req, res) {
    try {
      const { email, amount } = req.body;
      const response = await BlockchainService.burn(email, amount);
      Response.setSuccess(HttpStatusCode.STATUS_OK, 'Amount redeembed', response);
      return Response.send(res);
    } catch (error) {
      Response.setError(HttpStatusCode.STATUS_BAD_REQUEST, 'burn error', error);
      return Response.send(res);
    }
  }

  static async balance(req, res) {
    try {
      const { email } = req.params;
      const response = await BlockchainService.balance(email);
      Response.setSuccess(HttpStatusCode.STATUS_OK, 'Account balance retrieved successfully', response);
      return Response.send(res);
    } catch (error) {
      Response.setError(HttpStatusCode.STATUS_BAD_REQUEST, 'balance error', error);
      return Response.send(res);
    }
  }
}

module.exports = AppController;
