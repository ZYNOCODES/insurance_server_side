const { Op } = require('sequelize');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const Justification = require('../model/JustificationModel.js');
const Accusation = require('../model/AccusationModel.js');

//create accusation
const createAccusation = asyncErrorHandler(async (req, res, next) => {
    const { justification, description } = req.body;
    //check if all fields are filled
    if (!justification || !description) {
        const err = new CustomError('You must fill the accusation description', 400);
        return next(err);
    }
    //check if justification exists
    const justificationExists = await Justification.findByPk(justification);
    if (!justificationExists) {
        const err = new CustomError('Justification not found', 404);
        return next(err);
    }
    //create accusation
    const accusation = await Accusation.create({
        justification,
        description,
    });
    //check if accusation was created
    if (!accusation) {
        const err = new CustomError('Error creating accusation', 500);
        return next(err);
    }
    justificationExists.accused	= true;
    await justificationExists.save();
    res.status(201).json({message: 'Accusation created successfully'});
});

module.exports = {
    createAccusation
};
