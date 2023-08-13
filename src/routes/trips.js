const express = require("express");
const router = express.Router();
const { Auth } = require("../middleware/auth");
const { 
        TripController
    } = require("../controllers")
    const { 
        ParamValidator
     } = require('../validators')



router
.route('/rider-trip')
.post(
    Auth,
    TripController.riderStartTrip
);

router
  .route('/available-drivers/:riderId')
  .get(
    Auth,
    ParamValidator.RiderId,
    TripController.allAvailableDriverLocations
  )



module.exports = router;


 