const { Op } = require('sequelize');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const Justification = require('../model/JustificationModel.js');
const Accusation = require('../model/AccusationModel.js');
const Claim = require('../model/ClaimModel.js');

// display all Justifications by claim
const GetAllJustificationsByClaim = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    // Check if all required fields are present
    if (!id) {
        return next(new CustomError('Claim ID is required', 400));
    }
    // Check if claim exists
    const existingClaim = await Claim.findOne({
        where: {
            id: id,
            status: {
                [Op.or]: ['rejected'],
            },
        }
    });
    // Check if claim exists
    if (!existingClaim) {
        return next(new CustomError('Claim not found', 404));
    }
    // Get all Justifications by claim
    const Justifications = await Justification.findAll({
        where: { claim: id },
    });
    // check if Justifications exist
    if (!Justifications || Justifications.length <= 0) {
        return next(new CustomError('No Justifications found', 404));
    }
    // Extract justification IDs
    const justificationIds = Justifications.map(justification => justification.id);

    // Fetch all Accusations related to these Justifications
    const Accusations = await Accusation.findAll({
        where: { justification: { [Op.in]: justificationIds } },
    });

    // Map accusations to their respective justifications
    const justificationMap = Justifications.map(justification => {
        return {
            ...justification.toJSON(),
            accusations: Accusations?.filter(accusation => accusation.justification === justification.id),
        };
    });    
    // Send response
    res.status(200).json(justificationMap);
});

module.exports = {
    GetAllJustificationsByClaim,
};
