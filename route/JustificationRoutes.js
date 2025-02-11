const express = require('express');
const router = express.Router();
const {
    GetAllJustificationsByClaim
} = require('../controller/JustificationController.js');
const limiter = require('../middleware/RateLimiting.js');
const checkAuthentification = require('../middleware/RequireAuth.js');
const checkAuthrozation = require('../middleware/Authorization.js');


//secure routes below
router.use(checkAuthentification);

//PUBLIC ROUTES
//Get all Justifications by claim
router.get('/all/:id', limiter, checkAuthrozation([process.env.CLIENT_TYPE, process.env.INSURER_TYPE]), GetAllJustificationsByClaim);


module.exports = router;