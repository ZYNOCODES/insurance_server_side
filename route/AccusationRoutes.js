const express = require('express');
const router = express.Router();
const {
    createAccusation
} = require('../controller/AccusationController.js');
const limiter = require('../middleware/RateLimiting.js');
const checkAuthentification = require('../middleware/RequireAuth.js');
const checkAuthrozation = require('../middleware/Authorization.js');
const checkClientOwnership = require('../middleware/CheckClientOwnership.js');


//secure routes below
router.use(checkAuthentification);

//CLIENT ROUTES
//create accusation
router.post('/create/:id', limiter, checkAuthrozation([process.env.CLIENT_TYPE]), checkClientOwnership, createAccusation);


module.exports = router;