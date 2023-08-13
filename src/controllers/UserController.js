const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { SMSService,
  UserService,
  AuthService, 
  BlockchainService,
  WalletService} = require('../services');
const { Response,
  Rediscache } = require('../libs');
const { 
  HttpStatusCode,
  createHash
  } = require('../utils');





class UserController {

  static async addPhone(req, res, next) {

    try {
      const { phone } = req.body;
      const unique = await prisma.rider.findMany();
      let resultMobile = unique.map(a => a.mobile);
      const foundMobile = resultMobile.find(element => element === phone);
      if (foundMobile) {
        Response.setError(HttpStatusCode.STATUS_UNAUTHORIZED, 
          'Phone Number already exists');
        return Response.send(res);
      }
      const termiResponse = await SMSService.sendOTP(phone);
      const cached = await Rediscache.setCacheWithExpiration(
        phone,
        3600,
        JSON.stringify(termiResponse)
      );
      if (cached === "OK") {
        Response.setSuccess(
          HttpStatusCode.STATUS_OK, 
        'Phone Number added for verification', 
        termiResponse
        );
        return Response.send(res);
      }
    } catch (err) {
      Response.setError(
        HttpStatusCode.STATUS_INTERNAL_SERVER_ERROR,
        'Server Error. Please retry.'
      );
      return Response.send(res);
    }
  }


  static async verifyPhone(req, res, next) {
    try {
      const { phone, pin } = req.body;
      const result = await Rediscache.getCachedItem(phone);
      if (!result) {
        Response.setError(
          HttpStatusCode.STATUS_BAD_REQUEST, 
          'Invalid Phone Number');
        return Response.send(res);
      }
      const { pinId } = JSON.parse(result);
      const termiResponse = await SMSService.verifyOTP(pinId, pin);
      if (
        termiResponse.verified === false
      ) {
        Response.setError(
          HttpStatusCode.STATUS_BAD_REQUEST, 'Invalid Code Enter');
        return Response.send(res);
      }
      if (
        termiResponse.verified === 'Expired'
      ) {
        Response.setError(
          HttpStatusCode.STATUS_UNPROCESSABLE_ENTITY, 'Code Expired');
        return Response.send(res);
      } else if (termiResponse.status == 200 || termiResponse.verified) {
        const createdUser = await UserService.addUser({
          mobile: phone,
          mobileVerified: true
        });

        Response.setSuccess(
          HttpStatusCode.STATUS_OK, 'Phone Number verified', termiResponse);
        return Response.send(res);
      }
    } catch (err) {
      Response.setError(
        HttpStatusCode.STATUS_BAD,
        'Server error: Please try again later');
    }
  }

  static async createUser(req, res, next) {
    try {
      const { firstName,
        lastName,
        email,
        phone,
        password } = req.body;

      const findUser = await UserService.findUserByPhone(phone)
      if (!findUser) {
        Response.setError(
          HttpStatusCode.STATUS_RESOURCE_NOT_FOUND,
          'User not found'
        );
        return Response.send(res);
      } 


      console.log("find User", findUser)
      
      const hashedPassword = createHash(password);

      const user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword
      }
      const userUpdate = await UserService.updateUserByPhone(
        findUser.mobile, {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hashedPassword
        });

        if (!userUpdate) {
          Response.setError(
            HttpStatusCode.STATUS_RESOURCE_NOT_FOUND,
            'Something went wrong while updating user'
          );
          return Response.send(res);
        }

      const emailToken = await AuthService.createEmailVerificationToken(
        user,
        req.ip
      )

      if (!emailToken) {
        Response.setError(
          HttpStatusCode.STATUS_RESOURCE_NOT_FOUND,
          'Could not create email verification. Please try again'
        );
        return Response.send(res);
      }
      Response.setSuccess(HttpStatusCode.STATUS_OK, 'User Created', userUpdate);
      return Response.send(res);
    } catch (err) {
      Response.setError(
        HttpStatusCode.STATUS_BAD,
        'Server error: Please try again later'
      )
    }
  }

  static async verifyEmail(req, res) {
    try {
      const {riderEmail} = req.user;
      const foundUser = await UserService.findUserByEmail(
        riderEmail
        )
        if (!foundUser) {
          Response.setError(
            HttpStatusCode.STATUS_RESOURCE_NOT_FOUND,
            'User not found.'
          );
          return Response.send(res);
        }
       const wallet = await BlockchainService.createAccount(
        foundUser.email
        );
       const walletCreation = await WalletService.createWallet({
        riderId: foundUser.id,
        walletAddress: wallet.data.bantuAddress,
      })

      if (!walletCreation) {
        Response.setError(
          HttpStatusCode.STATUS_RESOURCE_NOT_FOUND,
          'Error creating wallet'
        );
        return Response.send(res);
      }
      const emailVerified = await UserService.updateUserByEmail(
        foundUser.email, {
          emailVerified: true,
          status: 'ACTIVE'
        })
        if (!emailVerified) {
          Response.setError(
            HttpStatusCode.STATUS_RESOURCE_NOT_FOUND,
            'Error creating wallet'
            );
          return Response.send(res);
        }
      Response.setSuccess(HttpStatusCode.STATUS_OK, 'Email Verified', emailVerified);
      return Response.send(res);
    } catch (error) {
      Response.setError(
        HttpStatusCode.STATUS_INTERNAL_SERVER_ERROR,
        'Email verification failed. Please try again.'
      );
      return Response.send(res);
    }
  }

}

module.exports = UserController;
