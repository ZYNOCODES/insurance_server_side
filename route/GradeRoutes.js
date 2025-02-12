const express = require('express');
const router = express.Router();
const {
    createNewGrade,
    updateGrade,
    deleteGrade,
    getAllGrades,
} = require('../controller/GradeController.js');
const limiter = require('../middleware/RateLimiting.js');
const checkAuthentification = require('../middleware/RequireAuth.js');
const checkAuthrozation = require('../middleware/Authorization.js');
const checkAdminOwnership = require('../middleware/CheckAdminOwnership.js');

//secure routes below
router.use(checkAuthentification);

//ADMIN ROUTES
//Create a new grade
router.post('/new/:id', limiter, checkAuthrozation([process.env.ADMIN_TYPE]), checkAdminOwnership, createNewGrade);
//Update a grade
router.patch('/update/:id', limiter, checkAuthrozation([process.env.ADMIN_TYPE]), checkAdminOwnership, updateGrade);
//Delete a grade
router.delete('/delete/:id', limiter, checkAuthrozation([process.env.ADMIN_TYPE]), checkAdminOwnership, deleteGrade);
//Get all grades
router.get('/all/:id', checkAuthrozation([process.env.ADMIN_TYPE]), checkAdminOwnership, getAllGrades);


module.exports = router;