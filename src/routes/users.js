const express = require("express");
const router = express.Router();
const validateNewUserBody = require("../middleware/validateNewUserBody")
const validatePhone = require("../middleware/validatePhone")
const { Auth } = require("../middleware/auth");
const { AppController,
        UserController,
        AuthController,
        WalletController
    } = require("../controllers")
const { 
    AuthValidator,
    WalletValidator
 } = require('../validators')



router.post("/create-account",  AppController.createAccount);
router.post("/mint",  AppController.mint);
router.post("/transfer",  AppController.transfer);
router.post("/burn",  AppController.burn);
router.get("/balance/:email",  AppController.balance); 


router.post("/add-phone", 
    validatePhone, 
    UserController.addPhone
);
router.post("/verify-phone",  UserController.verifyPhone);

router.post("/create-user", 
    validateNewUserBody, 
    UserController.createUser); 

router.post("/verify-email",
    AuthValidator.verifyEmailVerificationToken,
    UserController.verifyEmail);

router
.route('/wallets/fiat-deposit')
.post(
    Auth,
    WalletValidator.fiatDepositRules(),
    WalletValidator.validate,
    WalletController.fiatDeposit
);

module.exports = router;


 