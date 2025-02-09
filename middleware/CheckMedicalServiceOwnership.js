const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const MedicalService = require('../model/MedicalServiceModel.js');

const checkMedicalServiceOwnership = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //check if the MedicalService id is provided
    if (!id) {
        const err = new CustomError('Invalid medical service ID', 400);
        return next(err);
    }

    //check if the MedicalService is the same as the user authenticated
    if (id !== req.user.id.toString()) {
        const err = new CustomError('Unauthorized access', 401);
        return next(err);
    }

    //check if the MedicalService exist
    const existMedicalService = await MedicalService.findByPk(id);
    if (!existMedicalService) {
        const err = new CustomError('medical service not found', 400);
        return next(err);
    }

    next(); 
});

module.exports = checkMedicalServiceOwnership;
