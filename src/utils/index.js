const { config } = require('dotenv');
const { Config } = require('./config');

const { 
    HttpStatusCode, 
    ResponseStatus 
} = require('./responseCodes');

const {
    createHash,
    compareHash
} = require('./encryption');

const {
    GenerateOtp,
    generateFIATRef,
    generateAmount
} = require('./string');
const SanitizeObject = require('./sanitizeObject');

const constants = require('./constants')

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXP = process.env.JWT_EXP;







module.exports = {
    Config,
    HttpStatusCode,
    ResponseStatus,
    createHash,
    compareHash,
    GenerateOtp,
    generateAmount,
    generateFIATRef,
    SanitizeObject,
    JWT_SECRET,
    JWT_EXP,
    constants
}
