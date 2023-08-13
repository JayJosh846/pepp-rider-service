const homeRouter = require('./home.js');
const userRouter = require('./users.js');
const authRouter = require('./auth.js');
const webhooks = require('./webhooks.js');
const tripsRouter = require('./trips.js');

const express = require('express');
const { Router } = express;
const router = Router();

router.use('/home', homeRouter)
router.use('/user', userRouter)
router.use('/auth', authRouter)
router.use('/webhooks', webhooks)
router.use('/trips', tripsRouter) 



module.exports = router;
