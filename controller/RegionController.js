const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const Region = require('../model/RegionModel.js');
const User = require('../model/UserModel.js');

//Create a new region
const createNewRegion = asyncErrorHandler(async (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        return next(new CustomError('Please provide a name', 400));
    }
    //check if region already exists
    const regionExists = await Region.findOne({ where: { name } });
    if (regionExists) {
        return next(new CustomError('Region already exists', 400));
    }
    //create new region
    const newRegion = await Region.create({ name });
    if (!newRegion) {
        return next(new CustomError('Failed to create region', 500));
    }
    res.status(201).json({ 
        success: true,
        message: 'Region created successfully',
    });
});
//Update a region
const updateRegion = asyncErrorHandler(async (req, res, next) => {
    const { region, name } = req.body;
    if (!name || !region) {
        return next(new CustomError('All fields are required', 400));
    }
    //check if region exists
    const existingRegion = await Region.findByPk(region);
    if (!existingRegion) {
        return next(new CustomError('Region not found', 404));
    }
    //update region
    existingRegion.name = name;
    const updatedRegion = await existingRegion.save();
    if (!updatedRegion) {
        return next(new CustomError('Failed to update region', 500));
    }
    res.status(200).json({ 
        success: true,
        message: 'Region updated successfully',
    });
});
//Delete a region
const deleteRegion = asyncErrorHandler(async (req, res, next) => {
    const { region } = req.body;
    if (!region) {
        return next(new CustomError('Region ID is required', 400));
    }
    //check if region exists
    const existingRegion = await Region.findByPk(region);
    if (!existingRegion) {
        return next(new CustomError('Region not found', 404));
    }
    //check if region is used by any user
    const clients = await User.findOne({ where: { region } });
    if (clients) {
        return next(new CustomError('Region is being used by a user you cannot delete it', 400));
    }
    //delete region
    const deletedRegion = await existingRegion.destroy();
    if (!deletedRegion) {
        return next(new CustomError('Failed to delete region', 500));
    }
    res.status(200).json({ 
        success: true,
        message: 'Region deleted successfully',
    });
});
//Get all regions
const getAllRegions = asyncErrorHandler(async (req, res, next) => {
    const regions = await Region.findAll();
    if (!regions || regions.length <= 0) {
        return next(new CustomError('No regions found', 404));
    }
    res.status(200).json(regions);
});

module.exports = {
    createNewRegion,
    updateRegion,
    deleteRegion,
    getAllRegions,
};
