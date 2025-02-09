const validator = require('validator');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const Policy = require('../model/PolicyModel.js');
const Client = require('../model/ClientModel.js');

//Create a new Policy
const createNewPolicy = asyncErrorHandler(async (req, res, next) => {
    const { name, limit, co_pay, exclusions } = req.body;
    if (!name || !limit || !co_pay || !exclusions) {
        return next(new CustomError('All fields are required', 400));
    }
    //check if limit is a valid number greater than 0
    if (!validator.isNumeric(limit) || limit <= 0) {
        return next(new CustomError('Invalid limit value', 400));
    }
    //check if co_pay is a percentage value between 1 and 100
    if (!validator.isNumeric(co_pay) || co_pay < 1 || co_pay > 100) {
        return next(new CustomError('Invalid co_pay value', 400));
    }
    //check if Policy already exists
    const PolicyExists = await Policy.findOne({ where: { name } });
    if (PolicyExists) {
        return next(new CustomError('Policy already exists', 400));
    }
    //create new Policy
    const newPolicy = await Policy.create({ 
        name,
        limit,
        co_pay,
        exclusions,
    });
    if (!newPolicy) {
        return next(new CustomError('Failed to create Policy', 500));
    }
    res.status(201).json({ 
        success: true,
        message: 'Policy created successfully',
    });
});
//Update a Policy
const updatePolicy = asyncErrorHandler(async (req, res, next) => {
    const { policy, name, limit, co_pay, exclusions } = req.body;
    if (!name || !policy || !limit || !co_pay || !exclusions) {
        return next(new CustomError('All fields are required', 400));
    }
    //check if Policy exists
    const existingPolicy = await Policy.findByPk(policy);
    if (!existingPolicy) {
        return next(new CustomError('Policy not found', 404));
    }
    //update Policy
    if(name) {
        //check if Policy already exists
        const PolicyExists = await Policy.findOne({ where: { name } });
        if (PolicyExists) {
            return next(new CustomError('Policy already exists', 400));
        }
        existingPolicy.name = name;
    }
    if(limit) {
        //check if limit is a valid number greater than 0
        if (!validator.isNumeric(limit) || limit <= 0) {
            return next(new CustomError('Invalid limit value', 400));
        }
        existingPolicy.limit = limit;
    }
    if(co_pay) {
        //check if co_pay is a percentage value between 1 and 100
        if (!validator.isNumeric(co_pay) || co_pay < 1 || co_pay > 100) {
            return next(new CustomError('Invalid co_pay value', 400));
        }
        existingPolicy.co_pay = co_pay;
    }
    if(exclusions) {
        existingPolicy.exclusions = exclusions;
    }
    const updatedPolicy = await existingPolicy.save();
    if (!updatedPolicy) {
        return next(new CustomError('Failed to update Policy', 500));
    }
    res.status(200).json({ 
        success: true,
        message: 'Policy updated successfully',
    });
});
//Delete a Policy
const deletePolicy = asyncErrorHandler(async (req, res, next) => {
    const { policy } = req.body;
    if (!policy) {
        return next(new CustomError('Policy ID is required', 400));
    }
    //check if Policy exists
    const existingPolicy = await Policy.findByPk(policy);
    if (!existingPolicy) {
        return next(new CustomError('Policy not found', 404));
    }
    //check if Policy is in use in client
    const clientPolicy = await Client.findOne({ where: { policy } });
    if (clientPolicy) {
        return next(new CustomError('Policy is in use by a client you cannot delete it', 400));
    }
    //delete Policy
    const deletedPolicy = await existingPolicy.destroy();
    if (!deletedPolicy) {
        return next(new CustomError('Failed to delete Policy', 500));
    }
    res.status(200).json({ 
        success: true,
        message: 'Policy deleted successfully',
    });
});
//Get all Policys
const getAllPolicys = asyncErrorHandler(async (req, res, next) => {
    const policys = await Policy.findAll();
    if (!policys || policys.length <= 0) {
        return next(new CustomError('No policys found', 404));
    }
    res.status(200).json(policys);
});

module.exports = {
    createNewPolicy,
    updatePolicy,
    deletePolicy,
    getAllPolicys,
};
