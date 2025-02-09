const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const Admin = require('../model/AdminModel.js');

const checkAdminOwnership = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //check if the Admin id is provided
    if (!id) {
        const err = new CustomError('Invalid admin ID', 400);
        return next(err);
    }

    //check if the Admin is the same as the user authenticated
    if (id !== req.user.id.toString()) {
        const err = new CustomError('Unauthorized access', 401);
        return next(err);
    }

    //check if the Admin exist
    const existAdmin = await Admin.findByPk(id);
    if (!existAdmin) {
        const err = new CustomError('Admin not found', 400);
        return next(err);
    }

    next(); 
});

module.exports = checkAdminOwnership;
