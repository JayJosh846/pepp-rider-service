const {
    createHash,
    HttpStatusCode,
} = require('../utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Response, Logger } = require('../libs');
const Validator = require('validatorjs');

const {
    AuthService,
    UserService,
    BlockchainService,
} = require('../services');

class AuthController {

    static async signIn(req, res) {
        const { email, password } = req.body;
        try {
            const userFound = await UserService.findUserByEmail(email);
            if (userFound) {
                if (!userFound.emailVerified || !userFound.mobileVerified) {
                    Response.setError(
                        HttpStatusCode.STATUS_UNAUTHORIZED,
                        'Account not verified. Please verify your account');
                    return Response.send(res);
                }
                const balance = await BlockchainService.balance(userFound.email);
                const walletBalance = balance.Balance;
                const { user, token } = await AuthService.login(userFound, password.trim());
                Response.setSuccess(200, 'Login Successful.', {
                    user,
                    walletBalance,
                    token
                });
                return Response.send(res);
            } else {
                Response.setError(
                    HttpStatusCode.STATUS_UNAUTHORIZED,
                    'Email not registered.'
                );
                return Response.send(res);
            }
        } catch (error) {
            const message =
                error.status == 401
                    ? error.message
                    : 'Login failed. Please try again later.';
            Response.setError(401, message);
            return Response.send(res);
        }
    }



}


module.exports = AuthController;
