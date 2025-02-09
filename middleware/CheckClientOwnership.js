const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const Client = require('../model/ClientModel.js');

const checkClientOwnership = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //check if the client id is provided
    if (!id) {
        const err = new CustomError('Invalid client ID', 400);
        return next(err);
    }

    //check if the client is the same as the user authenticated
    if (id !== req.user.id.toString()) {
        const err = new CustomError('Unauthorized access', 401);
        return next(err);
    }

    //check if the client exist
    const existClient = await Client.findByPk(id);
    if (!existClient) {
        const err = new CustomError('Client not found', 400);
        return next(err);
    }

    next(); 
});

module.exports = checkClientOwnership;
