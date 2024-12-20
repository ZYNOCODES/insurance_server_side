const {Op} = require('sequelize');
const validator = require('validator');
const Role = require('../model/RoleModel.js');
const Region = require('../model/RegionModel.js');
const Wilaya = require('../model/WilayaModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const {
    createToken
} = require('../util/JWT.js');
const {
    comparePassword,
    hashPassword
} = require('../util/bcrypt.js');

// const _findUserByUsername = async (identifier) => {
//     return await Profile.findOne({
//         where: {
//             username: identifier
//         }
//     });
// };

// const _findUserByPhone = async (identifier) => {
//     return await Profile.findOne({
//         where: {
//             phone: identifier
//         }
//     });
// };



// module.exports = {
//     login,
//     register,
// };
