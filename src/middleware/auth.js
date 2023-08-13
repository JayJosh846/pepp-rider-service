require('dotenv').config();

const jwt = require('jsonwebtoken');
const {Response} = require('../libs');
const {HttpStatusCode} = require('../utils');
const {
  UserService,
} = require('../services');

const Auth = () => (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (err) {
        Response.setError(
          HttpStatusCode.STATUS_UNAUTHORIZED,
          'Unauthorised. Token Invalid'
        );
        return Response.send(res);
      }

      const user = await UserService.findUser(payload.userId);
      req.user = user;
      next();
    });
  } catch (error) {
    Response.setError(
      HttpStatusCode.STATUS_UNAUTHORIZED,
      'Unauthorised. Token Invalid'
    );
    return Response.send(res);
  }
};

exports.Auth = Auth();

