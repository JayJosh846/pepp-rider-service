const express = require("express");
const router = express.Router();
const validateLoginBody = require("../middleware/validateLoginBody")
const { AppController,
        UserController,
        AuthController } = require("../controllers")
const { AuthValidator } = require('../validators/index.js')



router.post("/login",
    validateLoginBody,  
    AuthController.signIn
);

module.exports = router;

 