const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const Insurer = require('../model/InsurerModel.js');

const checkInsurerOwnership = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //check if the insurer id is provided
    if (!id) {
        const err = new CustomError('Invalid insurer ID', 400);
        return next(err);
    }

    //check if the insurer is the same as the user authenticated
    if (id !== req.user.id.toString()) {
        const err = new CustomError('Unauthorized access', 401);
        return next(err);
    }

    //check if the insurer exist
    const existInsurer = await Insurer.findByPk(id);
    if (!existInsurer) {
        const err = new CustomError('Insurer not found', 400);
        return next(err);
    }

    next(); 
});

module.exports = checkInsurerOwnership;
