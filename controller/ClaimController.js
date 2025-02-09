const sequelize = require('../config/Database.js');
const { Op } = require('sequelize');
const validator = require('validator');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const Claim = require('../model/ClaimModel.js');
const MedicalService = require('../model/MedicalServiceModel.js');
const Insurer = require('../model/InsurerModel.js');
const Client = require('../model/ClientModel.js');
const User = require('../model/UserModel.js');
const Justification = require('../model/JustificationModel.js');
const Payment = require('../model/PaymentModel.js');

// Create new claim
const createNewClaim = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const { medicalservice, claim_amount } = req.body;
    //check if all required fields are present
    if (!medicalservice || !claim_amount) {
        return next(new CustomError('Medical service and claim amount are required fields', 400));
    }
    //check if claim amount is a number
    if (!validator.isNumeric(claim_amount) && claim_amount <= 0) {
        return next(new CustomError('Claim amount must be a number greater than 0', 400));
    }
    //check if medical service exists
    const medicalService = await MedicalService.findOne({
        where: {
            id: medicalservice,
        },
        include: [
            {
                model: User,
                as: 'userAssociation',
                attributes: ['region'],
            },
        ],
    });
    if (!medicalService) {
        return next(new CustomError('Medical service not found', 404));
    }
    
    //create new claim
    const newClaim = await Claim.create({
        client: id,
        medicalservice,
        claim_amount,
        status: 'pending',
        closed: false,
        region: medicalService.userAssociation.region,
    });
    //check if new claim was created
    if (!newClaim) {
        return next(new CustomError('Failed to create claim', 500));
    }
    //send response
    res.status(201).json({
        success: true,
        message: 'Claim created successfully',
    });
});
// Update claim 
const updateClaim = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const { claim, medicalservice, claim_amount } = req.body;
    
    //check if all required fields are present
    if (!claim || (!medicalservice && !claim_amount)) {
        return next(new CustomError('Medical service or claim amount is required', 400));
    }

    // check if claim exists
    const claimToUpdate = await Claim.findOne({
        where: {
            id: claim,
            client: id,
        },
    });
    if (!claimToUpdate) {
        return next(new CustomError('Claim not found', 404));
    }
    //check if claim was taken by insurer
    if (claimToUpdate.insurer) {
        return next(new CustomError('Claim already taken by insurer you cannot update it', 400));
    }
    //update claim
    if(medicalservice) {
        //check if medical service exists
        const medicalService = await MedicalService.findOne({
            where: {
                id: medicalservice,
            },
            include: [
                {
                    model: User,
                    as: 'userAssociation',
                    attributes: ['region'],
                },
            ],
        });
        if (!medicalService) {
            return next(new CustomError('Medical service not found', 404));
        }
        claimToUpdate.medicalservice = medicalservice;
        claimToUpdate.region = medicalService.userAssociation.region;
    }
    if(claim_amount) {
        //check if claim amount is a number
        if (!validator.isNumeric(claim_amount) && claim_amount <= 0) {
            return next(new CustomError('Claim amount must be a number greater than 0', 400));
        }
        claimToUpdate.claim_amount = claim_amount;
    }
    const updatedClaim = await claimToUpdate.save();
    //check if claim was updated
    if (!updatedClaim) {
        return next(new CustomError('Failed to update claim', 500));
    }
    //send response
    res.status(200).json({
        success: true,
        message: 'Claim updated successfully',
    });
});
// Delete claim 
const deleteClaim = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const { claim } = req.body;
    //check if all required fields are present
    if (!claim) {
        return next(new CustomError('Claim is required', 400));
    }
    // check if claim exists
    const claimToDelete = await Claim.findOne({
        where: {
            id: claim,
            client: id,
        },
    });
    if (!claimToDelete) {
        return next(new CustomError('Claim not found', 404));
    }
    //check if claim was taken by insurer
    if (claimToDelete.insurer) {
        return next(new CustomError('Claim already taken by insurer you cannot delete it', 400));
    }
    //delete claim
    const deletedClaim = await claimToDelete.destroy();
    //check if claim was deleted
    if (!deletedClaim) {
        return next(new CustomError('Failed to delete claim', 500));
    }
    //send response
    res.status(200).json({
        success: true,
        message: 'Claim deleted successfully',
    });
});
// Get all claims by client
const getAllClaimsByClient = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //get all claims
    const claims = await Claim.findAll({
        where: {
            client: id,
            closed: false,
            status: {
                [Op.or]: ['pending', 'approved', 'paid'],
            },
        },
        include: [
            {
                model: MedicalService,
                as: 'medicalServiceAssociation',
                attributes: ['user', 'type'],
                include: [
                    {
                        model: User,
                        as: 'userAssociation',
                        attributes: ['id', 'region', 'fullname', 'phone'],
                    },
                ],
            },
            {
                model: Insurer,
                as: 'insurerAssociation',
                attributes: ['user'],
                include: [
                    {
                        model: User,
                        as: 'userAssociation',
                        attributes: ['id', 'region', 'fullname', 'phone'],
                    },
                ],
            }
        ],
    });
    //check if claims were found
    if (!claims || claims.length <= 0) {
        return next(new CustomError('No claims found', 404));
    }
    //send response
    res.status(200).json({
        success: true,
        data: claims,
    });
});
// Get all archived claims by client
const getAllArchivedClaimsByClient = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //get all claims
    const claims = await Claim.findAll({
        where: {
            client: id,
            closed: true,
            status: {
                [Op.or]: ['paid', 'rejected'],
            },
        },
        include: [
            {
                model: MedicalService,
                as: 'medicalServiceAssociation',
                attributes: ['user', 'type'],
                include: [
                    {
                        model: User,
                        as: 'userAssociation',
                        attributes: ['id', 'region', 'fullname', 'phone'],
                    },
                ],
            },
            {
                model: Insurer,
                as: 'insurerAssociation',
                attributes: ['user'],
                include: [
                    {
                        model: User,
                        as: 'userAssociation',
                        attributes: ['id', 'region', 'fullname', 'phone'],
                    },
                ],
            }
        ],
    });
    //check if claims were found
    if (!claims || claims.length <= 0) {
        return next(new CustomError('No claims found', 404));
    }
    //send response
    res.status(200).json({
        success: true,
        data: claims,
    });
}); 
// Get all pending claims
const getAllPendingClaims = asyncErrorHandler(async (req, res, next) => {
    //get all claims
    const claims = await Claim.findAll({
        where:{
            closed: false,
            status: 'pending',
            region: req.user.userAssociation.region
        },
        include: [
            {
                model: MedicalService,
                as: 'medicalServiceAssociation',
                attributes: ['user', 'type'],
                include: [
                    {
                        model: User,
                        as: 'userAssociation',
                        attributes: ['id', 'region', 'fullname', 'phone'],
                    },
                ],
            },
            {
                model: Client,
                as: 'clientAssociation',
                attributes: ['user'],
                include: [
                    {
                        model: User,
                        as: 'userAssociation',
                        attributes: ['id', 'region', 'fullname', 'phone'],
                    },
                ],
            }
        ],
    });
    //check if claims were found
    if (!claims || claims.length <= 0) {
        return next(new CustomError('No claims found', 404));
    }
    //send response
    res.status(200).json({
        success: true,
        data: claims,
    });
});
// Get all approved claims
const getAllApprovedClaims = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //get all claims
    const claims = await Claim.findAll({
        where:{
            closed: false,
            status: 'approved',
            insurer: id,
        },
        include: [
            {
                model: MedicalService,
                as: 'medicalServiceAssociation',
                attributes: ['user', 'type'],
                include: [
                    {
                        model: User,
                        as: 'userAssociation',
                        attributes: ['id', 'region', 'fullname', 'phone'],
                    },
                ],
            },
            {
                model: Client,
                as: 'clientAssociation',
                attributes: ['user'],
                include: [
                    {
                        model: User,
                        as: 'userAssociation',
                        attributes: ['id', 'region', 'fullname', 'phone'],
                    },
                ],
            }
        ],
    });
    //check if claims were found
    if (!claims || claims.length <= 0) {
        return next(new CustomError('No claims found', 404));
    }
    //send response
    res.status(200).json({
        success: true,
        data: claims,
    });
});
// Get all paid claims
const getAllPaidClaims = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //get all claims
    const claims = await Claim.findAll({
        where:{
            closed: false,
            status: 'paid',
            insurer: id
        },
        include: [
            {
                model: MedicalService,
                as: 'medicalServiceAssociation',
                attributes: ['user', 'type'],
                include: [
                    {
                        model: User,
                        as: 'userAssociation',
                        attributes: ['id', 'region', 'fullname', 'phone'],
                    },
                ],
            },
            {
                model: Client,
                as: 'clientAssociation',
                attributes: ['user'],
                include: [
                    {
                        model: User,
                        as: 'userAssociation',
                        attributes: ['id', 'region', 'fullname', 'phone'],
                    },
                ],
            }
        ],
    });
    //check if claims were found
    if (!claims || claims.length <= 0) {
        return next(new CustomError('No claims found', 404));
    }
    //send response
    res.status(200).json({
        success: true,
        data: claims,
    });
});
// Get all rejected claims
const getAllRejectedClaims = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //get all claims
    const claims = await Claim.findAll({
        where:{
            closed: true,
            status: 'rejected',
            insurer: id
        },
        include: [
            {
                model: MedicalService,
                as: 'medicalServiceAssociation',
                attributes: ['user', 'type'],
                include: [
                    {
                        model: User,
                        as: 'userAssociation',
                        attributes: ['id', 'region', 'fullname', 'phone'],
                    },
                ],
            },
            {
                model: Client,
                as: 'clientAssociation',
                attributes: ['user'],
                include: [
                    {
                        model: User,
                        as: 'userAssociation',
                        attributes: ['id', 'region', 'fullname', 'phone'],
                    },
                ],
            }
        ],
    });
    //check if claims were found
    if (!claims || claims.length <= 0) {
        return next(new CustomError('No claims found', 404));
    }
    //send response
    res.status(200).json({
        success: true,
        data: claims,
    });
});
// take a claim by insurer
const takeClaimByInsurer = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const { claim } = req.body;
    //check if all required fields are present
    if (!claim) {
        return next(new CustomError('Claim is required', 400));
    }
    // check if claim exists
    const claimToTake = await Claim.findOne({
        where: {
            id: claim,
            status: 'pending',
            closed: false,
            region: req.user.userAssociation.region,
            insurer: null,
        },
    });
    if (!claimToTake) {
        return next(new CustomError('Claim not found', 404));
    }
    //take claim
    claimToTake.insurer = id;
    claimToTake.status = 'approved';
    const takenClaim = await claimToTake.save();
    //check if claim was taken
    if (!takenClaim) {
        return next(new CustomError('Failed to take claim', 500));
    }
    //send response
    res.status(200).json({
        success: true,
        message: 'Claim taken successfully',
    });
});
// reject a claim by insurer
const rejectClaimByInsurer = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const { claim, justification } = req.body;

    // Check if all required fields are present
    if (!claim || !justification) {
        return next(new CustomError('Tous les champs sont obligatoires', 400));
    }

    // Start transaction
    const transaction = await sequelize.transaction();
    try {
        // Check if claim exists
        const claimToReject = await Claim.findOne({
            where: {
                id: claim,
                status: 'pending',
                closed: false,
                region: req.user.userAssociation.region,
                insurer: null,
            },
            transaction
        });

        if (!claimToReject) {
            await transaction.rollback();
            return next(new CustomError('Claim not found', 404));
        }

        // Create new justification
        const newJustification = await Justification.create({
            claim,
            description: justification,
            accused: false,
        }, { transaction });

        if (!newJustification) {
            await transaction.rollback();
            return next(new CustomError('Failed to create justification', 500));
        }

        // Reject claim
        claimToReject.insurer = id;
        claimToReject.status = 'rejected';
        claimToReject.closed = true;

        const rejectedClaim = await claimToReject.save({ transaction });

        if (!rejectedClaim) {
            await transaction.rollback();
            return next(new CustomError('Failed to reject claim', 500));
        }

        // Commit transaction if all steps succeed
        await transaction.commit();

        // Send response
        res.status(200).json({
            success: true,
            message: 'Claim rejected successfully',
        });

    } catch (error) {
        // Rollback transaction on error
        await transaction.rollback();
        next(new CustomError('Failed to reject claim', 500));
    }
});
// pay a claim by insurer
const addPaymentToClaimByInsurer = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const { claim, amount } = req.body;

    // Check if all required fields are present
    if (!claim || !amount) {
        return next(new CustomError('All fields are required', 400));
    }

    // Check if amount is a number greater than 0
    if (!validator.isNumeric(amount.toString()) || parseFloat(amount) <= 0) {
        return next(new CustomError('Amount must be a number greater than 0', 400));
    }

    // Start transaction
    const transaction = await sequelize.transaction();
    try {
        // Check if claim exists
        const claimToPay = await Claim.findOne({
            where: {
                id: claim,
                status: 'approved',
                closed: false,
                region: req.user.userAssociation.region,
                insurer: id,
            },
            transaction
        });

        if (!claimToPay) {
            await transaction.rollback();
            return next(new CustomError('Claim not found', 404));
        }

        // Check if claim was closed by client
        if (claimToPay.closed) {
            await transaction.rollback();
            return next(new CustomError('Claim already closed by client', 400));
        }

        // Check if total payment amount is less than claim amount
        const existingPayments = await Payment.findAll({
            where: { claim },
            transaction
        });

        let totalPayment = existingPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

        if (totalPayment + parseFloat(amount) > claimToPay.claim_amount) {
            await transaction.rollback();
            return next(new CustomError('Total payment amount cannot be greater than claim amount', 400));
        }

        // Create new payment
        const newPayment = await Payment.create({
            claim,
            amount,
            validation: false,
        }, { transaction });

        if (!newPayment) {
            await transaction.rollback();
            return next(new CustomError('Failed to create payment', 500));
        }

        // Pay claim if the total payment matches the claim amount
        if (totalPayment + parseFloat(amount) === parseFloat(claimToPay.claim_amount)) {
            claimToPay.status = 'paid';
            claimToPay.closed = false;
        }

        const paidClaim = await claimToPay.save({ transaction });

        if (!paidClaim) {
            await transaction.rollback();
            return next(new CustomError('Failed to pay claim', 500));
        }

        // Commit transaction
        await transaction.commit();

        // Send response
        res.status(200).json({
            success: true,
            message: 'Claim paid successfully',
        });

    } catch (error) {
        // Rollback transaction on error
        await transaction.rollback();
        next(new CustomError('An error occurred while processing the payment', 500));
    }
});
// confirm payment of a claim by client
const confirmPaymentByClient = asyncErrorHandler(async (req, res, next) => {
    const { payment, claim } = req.body;

    // Check if all required fields are present
    if (!payment || !claim) {
        return next(new CustomError('All fields are required', 400));
    }

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
        // Check if payment exists and is not already validated
        const paymentToConfirm = await Payment.findOne({
            where: {
                id: payment,
                claim,
                validation: false,
            },
            transaction
        });

        if (!paymentToConfirm) {
            await transaction.rollback();
            return next(new CustomError('Payment not found', 404));
        }

        // Confirm payment
        paymentToConfirm.validation = true;
        await paymentToConfirm.save({ transaction });

        // Check if all payments for the claim are confirmed
        const unconfirmedPayments = await Payment.count({
            where: {
                claim,
                validation: false,
            },
            transaction
        });

        // If all payments are confirmed, close the claim
        if (unconfirmedPayments == 0) {
            const claimToClose = await Claim.findByPk(claim, { transaction });

            if (!claimToClose) {
                await transaction.rollback();
                return next(new CustomError('Claim not found', 404));
            }

            claimToClose.closed = true;
            await claimToClose.save({ transaction });
        }

        // Commit transaction
        await transaction.commit();

        // Send response
        res.status(200).json({
            success: true,
            message: 'Payment confirmed successfully',
        });

    } catch (error) {
        // Rollback transaction on error
        await transaction.rollback();
        next(new CustomError('An error occurred while confirming the payment', 500));
    }
});

module.exports = {
    createNewClaim,
    updateClaim,
    deleteClaim,
    getAllClaimsByClient,
    getAllArchivedClaimsByClient,
    getAllPendingClaims,
    getAllApprovedClaims,
    getAllPaidClaims,
    getAllRejectedClaims,
    takeClaimByInsurer,
    rejectClaimByInsurer,
    addPaymentToClaimByInsurer,
    confirmPaymentByClient,
}
