const express = require('express');
const router = express.Router();
const {
    ClientLogin,
    InsurerLogin,
    AdminLogin,
    MedicalServiceLogin,
    ClientRegister,
    InsurerRegister,
    AdminRegister,
    MedicalServiceRegister,
} = require('../controller/AuthController.js');
const limiter = require('../middleware/RateLimiting.js');
const checkAuthentification = require('../middleware/RequireAuth.js');
const checkAuthrozation = require('../middleware/Authorization.js');


//ROUTE
router.post('/client/login', limiter, ClientLogin);
router.post('/insurer/login', limiter, InsurerLogin);
router.post('/admin/login', limiter, AdminLogin);
router.post('/medical-service/login', limiter, MedicalServiceLogin);
router.post('/client/register', limiter, ClientRegister);

//secure routes below
router.use(checkAuthentification);
//ADMIN ROUTES
router.post('/admin/register', limiter, checkAuthrozation([process.env.ADMIN_TYPE]), AdminRegister);
router.post('/insurer/register', limiter, checkAuthrozation([process.env.ADMIN_TYPE]), InsurerRegister);
router.post('/medical-service/register', limiter, checkAuthrozation([process.env.ADMIN_TYPE]), MedicalServiceRegister);


module.exports = router;