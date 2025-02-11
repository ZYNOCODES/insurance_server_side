const express = require('express');
const router = express.Router();
const {
    CreateNewPaymentToClaimByInsurer,
    GetAllPaymentsByClaim,
    ValidatePaymentByClient,
} = require('../controller/PaymentController.js');
const limiter = require('../middleware/RateLimiting.js');
const checkAuthentification = require('../middleware/RequireAuth.js');
const checkAuthrozation = require('../middleware/Authorization.js');
const checkClientOwnership = require('../middleware/CheckClientOwnership.js');
const checkInsurerOwnership = require('../middleware/CheckInsurerOwnership.js');


//secure routes below
router.use(checkAuthentification);

//PUBLIC ROUTES
//Get all payments by claim
router.get('/all/:id', limiter, checkAuthrozation([process.env.CLIENT_TYPE, process.env.INSURER_TYPE]), GetAllPaymentsByClaim);

//INSURER ROUTES
//Create a new payment to claim by insurer
router.post('/new/:id', limiter, checkAuthrozation([process.env.INSURER_TYPE]), checkInsurerOwnership, CreateNewPaymentToClaimByInsurer);

//CLIENT ROUTES
//Validate payment by client
router.patch('/validate/:id', limiter, checkAuthrozation([process.env.CLIENT_TYPE]), checkClientOwnership, ValidatePaymentByClient);


module.exports = router;