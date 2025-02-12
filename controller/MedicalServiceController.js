const sequelize = require('../config/Database.js');
const validator = require('validator');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const MedicalService = require('../model/MedicalServiceModel.js');
const User = require('../model/UserModel.js');
const {
    hashPassword
} = require('../util/bcrypt.js');
const Region = require('../model/RegionModel.js');
const Claim = require('../model/ClaimModel.js');

// Update an MedicalService
const updateMedicalService = asyncErrorHandler(async (req, res, next) => {
    const {
        medicalService,
        username,
        password,
        phone,
        fullName,
        region,
        type,
        location,
    } = req.body;

    if (!medicalService || (!username && !password && !phone && !fullName && !region && !type && !location)) {
        return next(new CustomError('One of the fields is required', 400));
    }

    const transaction = await sequelize.transaction();

    try {
        // Check if MedicalService exists
        const existingMedicalService = await MedicalService.findByPk(medicalService, { transaction });
        if (!existingMedicalService) {
            await transaction.rollback();
            return next(new CustomError('Medical service not found', 404));
        }

        // Get the linked user
        const linkedUser = await User.findByPk(existingMedicalService.user, { transaction });
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

        // Update MedicalService details
        if (type) {
            if (!['doctor', 'pharmacy', 'organisation'].includes(type)) {
                return next(new CustomError('Invalid type', 400));
            }
            existingMedicalService.type = type;
        }
        if (location) existingMedicalService.location = location;

        await existingMedicalService.save({ transaction });

        await transaction.commit();

        res.status(200).json({
            status: 'success',
            message: 'Medical service updated successfully',
        });

    } catch (error) {
        await transaction.rollback();
        console.log(error);
        
        next(new CustomError('An error occurred while updating the MedicalService', 500));
    }
});
//Get all MedicalServices
const getAllMedicalServices = asyncErrorHandler(async (req, res, next) => {
    const MedicalServices = await MedicalService.findAll({
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
            }
        ],
    });
    if (!MedicalServices || MedicalServices.length <= 0) {
        return next(new CustomError('No MedicalServices found', 404));
    }
    res.status(200).json(MedicalServices);
});
//Delete a MedicalService
const deleteMedicalService = asyncErrorHandler(async (req, res, next) => {
    const { medicalService } = req.body;

    if (!medicalService) {
        return next(new CustomError('Medical service ID is required', 400));
    }

    const transaction = await sequelize.transaction();

    try {
        // Check if MedicalService exists
        const existingMedicalService = await MedicalService.findByPk(medicalService, { transaction });
        if (!existingMedicalService) {
            await transaction.rollback();
            return next(new CustomError('Medical service not found', 404));
        }

        // Check if no claim is linked to this MedicalService
        const linkedClaims = await Claim.count({
            where: {
                medicalservice: medicalService
            },
            transaction
        });

        if (linkedClaims > 0) {
            await transaction.rollback();
            return next(new CustomError('Cannot delete Medical service with linked claims', 400));
        }

        // Get the linked user
        const linkedUser = await User.findByPk(existingMedicalService.user, { transaction });
        if (!linkedUser) {
            await transaction.rollback();
            return next(new CustomError('Linked user not found', 404));
        }

        // Delete MedicalService
        await existingMedicalService.destroy({ transaction });

        // Delete linked User
        await linkedUser.destroy({ transaction });

        await transaction.commit();

        res.status(200).json({
            status: 'success',
            message: 'Medical service deleted successfully',
        });
    } catch (error) {
        await transaction.rollback();
        next(new CustomError('An error occurred while deleting the MedicalService', 500));
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
    updateMedicalService,
    deleteMedicalService,
    getAllMedicalServices,
};
