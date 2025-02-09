const express = require('express');
const router = express.Router();
const {
    createNewClaim,
    updateClaim,
    deleteClaim,
    getAllClaimsByClient,
    getAllArchivedClaimsByClient,
    getAllPendingClaims,
    getAllApprovedClaims,
    getAllPaidClaims,
    getAllRejectedClaims,
    takeClaimByInsurer,
    rejectClaimByInsurer,
    addPaymentToClaimByInsurer,
    confirmPaymentByClient,
    getClientClaimStatistics
} = require('../controller/ClaimController.js');
const limiter = require('../middleware/RateLimiting.js');
const checkAuthentification = require('../middleware/RequireAuth.js');
const checkAuthrozation = require('../middleware/Authorization.js');
const checkClientOwnership = require('../middleware/CheckClientOwnership.js');
const checkInsurerOwnership = require('../middleware/CheckInsurerOwnership.js');


//secure routes below
router.use(checkAuthentification);

//CLIENT ROUTES
//Create a new claim
router.post('/client/new/:id', limiter, checkAuthrozation([process.env.CLIENT_TYPE]), checkClientOwnership, createNewClaim);
//Update a claim
router.patch('/client/update/:id', limiter, checkAuthrozation([process.env.CLIENT_TYPE]), checkClientOwnership, updateClaim);
//Delete a claim
router.delete('/client/delete/:id', limiter, checkAuthrozation([process.env.CLIENT_TYPE]), checkClientOwnership, deleteClaim);
//Get all claims by client
router.get('/client/all/:id', checkAuthrozation([process.env.CLIENT_TYPE]), checkClientOwnership, getAllClaimsByClient);
//Get all archived claims by client
router.get('/client/archived/:id', checkAuthrozation([process.env.CLIENT_TYPE]), checkClientOwnership, getAllArchivedClaimsByClient);
//Confirm payment by client
router.post('/client/confirm/:id', limiter, checkAuthrozation([process.env.CLIENT_TYPE]), checkClientOwnership, confirmPaymentByClient);
//Get client claim statistics
router.get('/client/statistics/:id', checkAuthrozation([process.env.CLIENT_TYPE]), checkClientOwnership, getClientClaimStatistics);

//INSURER ROUTES
//Get all pending claims
router.get('/insurer/pending', checkAuthrozation([process.env.INSURER_TYPE]), getAllPendingClaims);
//Get all approved claims
router.get('/insurer/approved/:id', checkAuthrozation([process.env.INSURER_TYPE]), checkInsurerOwnership, getAllApprovedClaims);
//Get all paid claims
router.get('/insurer/paid/:id', checkAuthrozation([process.env.INSURER_TYPE]), checkInsurerOwnership, getAllPaidClaims);
//Get all rejected claims
router.get('/insurer/rejected/:id', checkAuthrozation([process.env.INSURER_TYPE]), checkInsurerOwnership, getAllRejectedClaims);
//Take a claim by insurer
router.patch('/insurer/take/:id', limiter, checkAuthrozation([process.env.INSURER_TYPE]), checkInsurerOwnership, takeClaimByInsurer);
//Reject a claim by insurer
router.patch('/insurer/reject/:id', limiter, checkAuthrozation([process.env.INSURER_TYPE]), checkInsurerOwnership, rejectClaimByInsurer);
//Pay a claim by insurer
router.patch('/insurer/pay/:id', limiter, checkAuthrozation([process.env.INSURER_TYPE]), checkInsurerOwnership, addPaymentToClaimByInsurer);



module.exports = router;