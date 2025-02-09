const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const MedicalService = require('../model/MedicalServiceModel.js');
const User = require('../model/UserModel.js');

//Get all Medical Services
const getAllMedicalService = asyncErrorHandler(async (req, res, next) => {
    const existingMedicalService = await MedicalService.findAll({
        include: [{
            model: User,
            as: 'userAssociation',
            attributes: ['fullname','phone'],
        }],
    });
    //check if there are any Medical Services
    if (!existingMedicalService || existingMedicalService.length <= 0) {
        return next(new CustomError('No medical service was found', 404));
    }
    res.status(200).json(existingMedicalService);
});

module.exports = {
    getAllMedicalService,
};
