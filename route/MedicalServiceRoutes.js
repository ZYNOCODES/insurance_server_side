const express = require('express');
const router = express.Router();
const {
    updateMedicalService,
    deleteMedicalService,
    getAllMedicalServices,
} = require('../controller/MedicalServiceController.js');
const limiter = require('../middleware/RateLimiting.js');
const checkAuthentification = require('../middleware/RequireAuth.js');
const checkAuthrozation = require('../middleware/Authorization.js');
const checkAdminOwnership = require('../middleware/CheckAdminOwnership.js');


//secure routes below
router.use(checkAuthentification);

//PUBLIC ROUTES
//Get all Medical Services
router.get('/all', getAllMedicalServices);

//ADMIN ROUTES
//update medical service
router.patch('/update/:id', limiter, checkAuthrozation([process.env.ADMIN_TYPE]), checkAdminOwnership, updateMedicalService);
//delete medical service
router.delete('/delete/:id', limiter, checkAuthrozation([process.env.ADMIN_TYPE]), checkAdminOwnership, deleteMedicalService);

module.exports = router;