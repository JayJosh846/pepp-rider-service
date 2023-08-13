const {
    createHash,
    GenerateOtp,
    compareHash,
    JWT_SECRET,
    JWT_EXP
} = require('../utils');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const {
    UserService,
    SMSService
} = require('../services');
const MailerService = require('./MailerService')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()



class AuthService {

    static async login(user, _password) {
        const error = new Error();
        return new Promise(async function (resolve, reject) {
                const { id, password } = user;
                if (bcrypt.compareSync(_password, password)) {
                    const token = jwt.sign(
                        {
                            userId: id
                        },
                        JWT_SECRET,
                        {
                            expiresIn: JWT_EXP
                        }
                    );
                    resolve({
                        user,
                        token
                    });
                }
                error.status = 401;
                error.message = 'Password incorrect';
                reject(error);

        });
    }


    static async createEmailVerificationToken({
        firstName,
        lastName,
        email
    } = user,
        request_ip,
        expiresAfter = 60) {
        const ref = uuidv4();
        const otp = GenerateOtp();
        const token = createHash(otp);
        const expires_at = moment().add(expiresAfter, 'm').toDate();
        const name = firstName ? lastName : '';
        const emailVerification = await prisma.emailverificationtoken.create({
            data: {
                references: ref,
                riderEmail: email,
                token,
                requestIp: request_ip,
                expiresAt: expires_at
            }
        });
        await MailerService.sendOTP(
            otp, ref, email, name);
        // await SmsService.sendOtp(
        //   user.phone,
        //   `Hi ${name}, your CHATS emailVerification password OTP is: ${otp} and ref is: ${emailVerification.ref}`
        // );
        return emailVerification;
    }

    static async checkEmailVerificationToken(references) {
        return await prisma.emailverificationtoken.findUnique(
            {
                where: {
                    references
                }
            })
    }




    // static async login () {
    //     const user = await context.prisma.user.findUnique({
    //         where: { email: args.email },
    //       });
    //       if (!user) {
    //         throw new AuthenticationError("No such user found");
    //       }
    //       // if (user.role !== "ADMIN") {
    //       //   throw new Error("User is not an Admin");

    //       // }

    //       if (user.mobileVerified === false) {
    //         throw new AuthenticationError("Your Phone Number is not verified");
    //       }
    //       const valid = await bcrypt.compare(args.password, user.password);
    //       if (!valid) {
    //         throw new AuthenticationError("Invalid password");
    //       }

    //       const token = jwt.sign({ userId: user.id }, JWT_SECRET,
    //         { expiresIn: JWT_EXP }
    //       );
    //       return {
    //         token,
    //         user,
    //       };
    // }
}


module.exports = AuthService;
