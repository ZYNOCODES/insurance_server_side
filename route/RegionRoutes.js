const express = require('express');
const router = express.Router();
const {
    createNewRegion,
    updateRegion,
    deleteRegion,
    getAllRegions,
} = require('../controller/RegionController.js');
const limiter = require('../middleware/RateLimiting.js');
const checkAuthentification = require('../middleware/RequireAuth.js');
const checkAuthrozation = require('../middleware/Authorization.js');
const checkAdminOwnership = require('../middleware/CheckAdminOwnership.js');


//PUBLIC ROUTES
//Get all regions
router.get('/all', getAllRegions);

//secure routes below
router.use(checkAuthentification);

//ADMIN ROUTES
//Create a new region
router.post('/new/:id', limiter, checkAuthrozation([process.env.ADMIN_TYPE]), checkAdminOwnership, createNewRegion);
//Update a region
router.patch('/update/:id', limiter, checkAuthrozation([process.env.ADMIN_TYPE]), checkAdminOwnership, updateRegion);
//Delete a region
router.delete('/delete/:id', limiter, checkAuthrozation([process.env.ADMIN_TYPE]), checkAdminOwnership, deleteRegion);

module.exports = router;