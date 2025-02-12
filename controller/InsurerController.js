const sequelize = require('../config/Database.js');
const validator = require('validator');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const Insurer = require('../model/InsurerModel.js');
const User = require('../model/UserModel.js');
const {
    hashPassword
} = require('../util/bcrypt.js');
const Region = require('../model/RegionModel.js');
const Grade = require('../model/GradeModel.js');
const Claim = require('../model/ClaimModel.js');

// Update an Insurer
const updateInsurer = asyncErrorHandler(async (req, res, next) => {
    const {
        insurer,
        username,
        password,
        phone,
        fullName,
        region,
        grade,
    } = req.body;

    if (!insurer || (!username && !password && !phone && !fullName && !region && !grade)) {
        return next(new CustomError('One of the fields is required', 400));
    }

    const transaction = await sequelize.transaction();

    try {
        // Check if Insurer exists
        const existingInsurer = await Insurer.findByPk(insurer, { transaction });
        if (!existingInsurer) {
            await transaction.rollback();
            return next(new CustomError('Insurer not found', 404));
        }

        // Get the linked user
        const linkedUser = await User.findByPk(existingInsurer.user, { transaction });
        if (!linkedUser) {
            await transaction.rollback();
            return next(new CustomError('Linked user not found', 404));
        }

        // Update User details
        if (username) {
            const existingUsername = await _findUserByUsername(username);
            if (existingUsername && existingUsername.id !== linkedUser.id) {
                await transaction.rollback();
                return next(new CustomError('This username is already used', 400));
            }
            linkedUser.username = username;
        }

        if (password) {
            if (!validator.isStrongPassword(password)) {
                await transaction.rollback();
                return next(new CustomError('Password is not strong enough', 400));
            }
            linkedUser.password = await hashPassword(password);
        }

        if (phone) {
            const existingPhone = await _findUserByPhone(phone);
            if (existingPhone && existingPhone.id !== linkedUser.id) {
                await transaction.rollback();
                return next(new CustomError('This phone is already used', 400));
            }
            linkedUser.phone = phone;
        }
        if (region) {
            const existingRegion = await Region.findByPk(region);
            if(!existingRegion){
                return next(new CustomError('Invalid region', 400));
            }
            linkedUser.region = region;
        }
        if (fullName) linkedUser.fullName = fullName;

        await linkedUser.save({ transaction });

        // Update Insurer details
        if (grade) {
            const existingGrade = await Grade.findByPk(grade);
            if(!existingGrade){
                return next(new CustomError('Invalid grade', 400));
            }
            existingInsurer.grade = grade;
        }

        await existingInsurer.save({ transaction });

        await transaction.commit();

        res.status(200).json({
            status: 'success',
            message: 'Insurer updated successfully',
        });

    } catch (error) {
        await transaction.rollback();
        next(new CustomError('An error occurred while updating the insurer', 500));
    }
});
//Get all Insurers
const getAllInsurers = asyncErrorHandler(async (req, res, next) => {
    const Insurers = await Insurer.findAll({
        include: [
            {
                model: User,
                as: 'userAssociation',
                attributes: ['username', 'fullname', 'phone', 'region'],
                include: {
                    model: Region,
                    as: 'regionAssociation',
                    attributes: ['name']
                }
            },
            {
                model: Grade,
                as: 'gradeAssociation',
                attributes: ['name'],
            }
        ],
    });
    if (!Insurers || Insurers.length <= 0) {
        return next(new CustomError('No Insurers found', 404));
    }
    res.status(200).json(Insurers);
});
//Delete a Insurer
const deleteInsurer = asyncErrorHandler(async (req, res, next) => {
    const { insurer } = req.body;

    if (!insurer) {
        return next(new CustomError('Insurer ID is required', 400));
    }

    const transaction = await sequelize.transaction();

    try {
        // Check if Insurer exists
        const existingInsurer = await Insurer.findByPk(insurer, { transaction });
        if (!existingInsurer) {
            await transaction.rollback();
            return next(new CustomError('Insurer not found', 404));
        }

        // Check if no claim is linked to this insurer
        const linkedClaims = await Claim.count({
            where: {
                insurer: insurer
            },
            transaction
        });

        if (linkedClaims > 0) {
            await transaction.rollback();
            return next(new CustomError('Cannot delete insurer with linked claims', 400));
        }

        // Get the linked user
        const linkedUser = await User.findByPk(existingInsurer.user, { transaction });
        if (!linkedUser) {
            await transaction.rollback();
            return next(new CustomError('Linked user not found', 404));
        }

        // Delete Insurer
        await existingInsurer.destroy({ transaction });

        // Delete linked User
        await linkedUser.destroy({ transaction });

        await transaction.commit();

        res.status(200).json({
            status: 'success',
            message: 'Insurer deleted successfully',
        });
    } catch (error) {
        await transaction.rollback();
        next(new CustomError('An error occurred while deleting the insurer', 500));
    }
});

const _findUserByUsername = async (identifier) => {
    return await User.findOne({
        where: {
            username: identifier
        },
        include: [
            {
                model: Region,
                as: 'regionAssociation',
                attributes: ['name'],
            }
        ],
    });
};

const _findUserByPhone = async (identifier) => {
    return await User.findOne({
        where: {
            phone: identifier
        },
        include: [
            {
                model: Region,
                as: 'regionAssociation',
                attributes: ['name'],
            }
        ],
    });
};

module.exports = {
    updateInsurer,
    deleteInsurer,
    getAllInsurers,
};
