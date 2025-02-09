const express = require('express');
const router = express.Router();
const {
    getAllMedicalService
} = require('../controller/MedicalServiceController.js');
const limiter = require('../middleware/RateLimiting.js');
const checkAuthentification = require('../middleware/RequireAuth.js');
const checkAuthrozation = require('../middleware/Authorization.js');
const checkAdminOwnership = require('../middleware/CheckAdminOwnership.js');


//secure routes below
router.use(checkAuthentification);

//PUBLIC ROUTES
//Get all Medical Services
router.get('/all', limiter, getAllMedicalService);


module.exports = router;