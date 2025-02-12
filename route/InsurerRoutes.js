const express = require('express');
const router = express.Router();
const {
    updateInsurer,
    deleteInsurer,
    getAllInsurers,
} = require('../controller/InsurerController.js');
const limiter = require('../middleware/RateLimiting.js');
const checkAuthentification = require('../middleware/RequireAuth.js');
const checkAuthrozation = require('../middleware/Authorization.js');
const checkAdminOwnership = require('../middleware/CheckAdminOwnership.js');


//secure routes below
router.use(checkAuthentification);

//ADMIN ROUTES
//Get all insurers
router.get('/all/:id', limiter, checkAuthrozation([process.env.ADMIN_TYPE]), checkAdminOwnership, getAllInsurers);
//update insurer
router.patch('/update/:id', limiter, checkAuthrozation([process.env.ADMIN_TYPE]), checkAdminOwnership, updateInsurer);
//delete insurer
router.delete('/delete/:id', limiter, checkAuthrozation([process.env.ADMIN_TYPE]), checkAdminOwnership, deleteInsurer);

module.exports = router;