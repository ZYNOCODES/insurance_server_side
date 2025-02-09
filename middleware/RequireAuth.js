const jwt = require('jsonwebtoken');
const Client = require('../model/ClientModel.js');
const Admin = require('../model/AdminModel.js');
const MedicalService = require('../model/MedicalServiceModel.js');
const Insurer = require('../model/InsurerModel.js');
const CustomError = require('../util/CustomError');
const asyncErrorHandler = require('../util/asyncErrorHandler');
const moment = require('../util/Moment.js');
const User = require('../model/UserModel.js');

const requireAuth = asyncErrorHandler(async (req, res, next) => {
    const currentTime = moment.getCurrentDateTime(); // Ensures UTC+1
    // Check if User is logged in
    const {authorization} = req.headers;
    
    if(!authorization || !authorization.startsWith('Bearer ')){
        // If User is not logged in, return error
        const err = new CustomError('authorization token is required', 401);
        return next(err);
    }
    // Get token from header
    const token = authorization.split(' ')[1];

    // Verify token
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
        console.log(err)
        const error = new CustomError('Invalid or expired token. Please log in again.', 401);
        return next(error);
    }

    const { id, role, exp } = decodedToken;    
    // Check if the token has expired
    if (currentTime.isSameOrAfter(exp * 1000)) {
        const err = new CustomError('Token has expired. Please log in again.', 401);
        return next(err);
    }
    // check user exists and assign to req.user
    switch (role) {
        case process.env.CLIENT_TYPE:
            req.user = await Client.findOne({
                where: { id },
                include: {
                    model: User,
                    as: 'userAssociation',
                    attributes: ['region']
                }
            })
            break;
        case process.env.ADMIN_TYPE:
            req.user = await Admin.findOne({
                where: { id },
                include: {
                    model: User,
                    as: 'userAssociation',
                    attributes: ['region']
                }
            });
            break;
        case process.env.MEDICALSERVICE_TYPE:
            req.user = await MedicalService.findOne({
                where: { id },
                include: {
                    model: User,
                    as: 'userAssociation',
                    attributes: ['region']
                }
            })
            break;
        case process.env.INSURER_TYPE:
            req.user = await Insurer.findOne({
                where: { id },
                include: {
                    model: User,
                    as: 'userAssociation',
                    attributes: ['region']
                }
            })
            break;
        default:
            const err = new CustomError('Authentication rejected', 401);
            return next(err);
    }
    // Check if the user was found
    if(!req.user){
        const err = new CustomError('Something went wrong. Please log in again.', 401);
        return next(err);
    }
    // Continue to next middleware
    next();
});

module.exports = requireAuth;