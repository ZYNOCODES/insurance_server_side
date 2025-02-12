const validator = require('validator');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const Grade = require('../model/GradeModel.js');
const Insurer = require('../model/InsurerModel.js');

//Create a new Grade
const createNewGrade = asyncErrorHandler(async (req, res, next) => {
    const { name, exclusions } = req.body;
    if (!name || !exclusions) {
        return next(new CustomError('All fields are required', 400));
    }
    //check if exclusions is valid enum value 
    if (!validator.isIn(exclusions, ['secure', 'confidential', 'unclassified'])) {
        return next(new CustomError('Invalid exclusions value', 400));
    }
    //check if Grade already exists
    const GradeExists = await Grade.findOne({ where: { name } });
    if (GradeExists) {
        return next(new CustomError('Grade already exists', 400));
    }
    //create new Grade
    const newGrade = await Grade.create({ 
        name,
        exclusions,
    });
    if (!newGrade) {
        return next(new CustomError('Failed to create Grade', 500));
    }
    res.status(201).json({ 
        success: true,
        message: 'Grade created successfully',
    });
});
//Update a Grade
const updateGrade = asyncErrorHandler(async (req, res, next) => {
    const { grade, name, exclusions } = req.body;
    if (!grade || (!name && !exclusions)) {
        return next(new CustomError('One of the fields is required', 400));
    }
    //check if Grade exists
    const existingGrade = await Grade.findByPk(grade);
    if (!existingGrade) {
        return next(new CustomError('Grade not found', 404));
    }
    //update Grade
    if(name) {
        //check if Grade already exists
        const GradeExists = await Grade.findOne({ where: { name } });
        if (GradeExists) {
            return next(new CustomError('Grade already exists', 400));
        }
        existingGrade.name = name;
    }
    if(exclusions) {
        //check if exclusions is valid enum value 
        if (!validator.isIn(exclusions, ['secure', 'confidential', 'unclassified'])) {
            return next(new CustomError('Invalid exclusions value', 400));
        }
        existingGrade.exclusions = exclusions;
    }
    const updatedGrade = await existingGrade.save();
    if (!updatedGrade) {
        return next(new CustomError('Failed to update grade', 500));
    }
    res.status(200).json({ 
        success: true,
        message: 'Grade updated successfully',
    });
});
//Delete a Grade
const deleteGrade = asyncErrorHandler(async (req, res, next) => {
    const { grade } = req.body;
    if (!grade) {
        return next(new CustomError('Grade ID is required', 400));
    }
    //check if Grade exists
    const existingGrade = await Grade.findByPk(grade);
    if (!existingGrade) {
        return next(new CustomError('Grade not found', 404));
    }
    //check if Grade is in use in a insurer
    const insurers = await Insurer.findOne({ where: { grade } });
    if (insurers) {
        return next(new CustomError('Grade is in use by an insurer you cannot delete it', 400));
    }
    //delete Grade
    const deletedGrade = await existingGrade.destroy();
    if (!deletedGrade) {
        return next(new CustomError('Failed to delete Grade', 500));
    }
    res.status(200).json({ 
        success: true,
        message: 'Grade deleted successfully',
    });
});
//Get all Grades
const getAllGrades = asyncErrorHandler(async (req, res, next) => {
    const grades = await Grade.findAll();
    if (!grades || grades.length <= 0) {
        return next(new CustomError('No grades found', 404));
    }
    res.status(200).json(grades);
});

module.exports = {
    createNewGrade,
    updateGrade,
    deleteGrade,
    getAllGrades,
};
