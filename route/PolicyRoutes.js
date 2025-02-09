const express = require('express');
const router = express.Router();
const {
    createNewPolicy,
    updatePolicy,
    deletePolicy,
    getAllPolicys,
} = require('../controller/PolicyController.js');
const limiter = require('../middleware/RateLimiting.js');
const checkAuthentification = require('../middleware/RequireAuth.js');
const checkAuthrozation = require('../middleware/Authorization.js');
const checkAdminOwnership = require('../middleware/CheckAdminOwnership.js');


//PUBLIC ROUTES
//Get all Policys
router.get('/all', limiter, getAllPolicys);

//secure routes below
router.use(checkAuthentification);

//ADMIN ROUTES
//Create a new Policy
router.post('/new/:id', limiter, checkAuthrozation([process.env.ADMIN_TYPE]), checkAdminOwnership, createNewPolicy);
//Update a Policy
router.patch('/update/:id', limiter, checkAuthrozation([process.env.ADMIN_TYPE]), checkAdminOwnership, updatePolicy);
//Delete a Policy
router.delete('/delete/:id', limiter, checkAuthrozation([process.env.ADMIN_TYPE]), checkAdminOwnership, deletePolicy);

module.exports = router;