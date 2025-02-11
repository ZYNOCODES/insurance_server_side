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
const Region = require('../model/RegionModel.js');
const Policy = require('../model/PolicyModel.js');

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
    //check client policy
    const clientPolicy = await Policy.findOne({
        where: {
            id: req.user.policy,
        },
    });
    if (!clientPolicy) {
        return next(new CustomError('Client policy not found', 404));
    }
    //check if claim amount for this year is less than policy limit
    const currentYear = new Date().getFullYear();
    const claimsThisYear = await Claim.findAll({
        where: {
            client: id,
            date: {
                [Op.gte]: new Date(currentYear, 0, 1),
            }
        },
    });
    const totalClaimsThisYear = claimsThisYear.reduce((sum, claim) => sum + parseFloat(claim.claim_amount), 0);    
    if (totalClaimsThisYear + parseFloat(claim_amount) > clientPolicy.limit) {
        return next(new CustomError('Claim amount exceeds policy limit', 400));
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
            },
            {
                model: Region,
                as: 'regionAssociation',
                attributes: ['name'],
            }
        ],
    });
    //check if claims were found
    if (!claims || claims.length <= 0) {
        return next(new CustomError('No claims found', 404));
    }
    // Filter claims with status "paid"
    const paidClaims = claims.filter((claim) => claim.status === 'paid');
    
    // Fetch payments for all "paid" claims in a single query
    const payments = await Payment.findAll({
        where: {
            claim: paidClaims.map((claim) => claim.id),
        },
    });

    // Map payments to their respective claims
    const paymentMap = payments.reduce((map, payment) => {
        if (!map[payment.claim]) {
            map[payment.claim] = 0;
        }
        map[payment.claim] += parseFloat(payment.amount);
        return map;
    }, {});

    // Add reimbursement amount to paid claims
    const updatedClaims = claims.map((claim) => {
        if (claim.status === 'paid') {
            claim.dataValues.reimbursement = paymentMap[claim.id] || 0;
        }
        return claim;
    });    
    //send response
    res.status(200).json(updatedClaims);
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
            },
            {
                model: Region,
                as: 'regionAssociation',
                attributes: ['name'],
            }
        ],
    });
    //check if claims were found
    if (!claims || claims.length <= 0) {
        return next(new CustomError('No claims found', 404));
    }
    // Filter claims with status "paid"
    const paidClaims = claims.filter((claim) => claim.status === 'paid');
    const rejectedClaims = claims.filter((claim) => claim.status === 'rejected');

    // Fetch payments for all "paid" claims in a single query
    const payments = await Payment.findAll({
        where: {
            claim: paidClaims.map((claim) => claim.id),
        },
    });

    // Map payments to their respective claims
    const paymentMap = payments.reduce((map, payment) => {
        if (!map[payment.claim]) {
            map[payment.claim] = 0;
        }
        map[payment.claim] += parseFloat(payment.amount);
        return map;
    }, {});

    //Fetch justification for all "rejected" claims in a single query
    const justifications = await Justification.findAll({
        where: {
            claim: rejectedClaims.map((claim) => claim.id),
        },
    });
    
    // Add reimbursement amount to paid claims
    const updatedClaims = claims.map((claim) => {
        if (claim.status === 'paid') {
            claim.dataValues.reimbursement = paymentMap[claim.id] || 0;
        }
        if (claim.status === 'rejected') {
            claim.dataValues.justification = justifications.find((justification) => justification.claim === claim.id);
        }
        return claim;
    });
    
    //send response
    res.status(200).json(updatedClaims);
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
                    {
                        model: Policy,
                        as: 'policyAssociation',
                        attributes: ['name', 'limit', 'co_pay', 'exclusions'],
                    }
                ],
            },
            {
                model: Region,
                as: 'regionAssociation',
                attributes: ['name'],
            }
        ],
    });
    //check if claims were found
    if (!claims || claims.length <= 0) {
        return next(new CustomError('No claims found', 404));
    }
    //send response
    res.status(200).json(claims);
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
                    {
                        model: Policy,
                        as: 'policyAssociation',
                        attributes: ['name', 'limit', 'co_pay', 'exclusions'],
                    }
                ],
            },
            {
                model: Region,
                as: 'regionAssociation',
                attributes: ['name'],
            }
        ],
    });
    //check if claims were found
    if (!claims || claims.length <= 0) {
        return next(new CustomError('No claims found', 404));
    }
    //send response
    res.status(200).json(claims);
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
                    {
                        model: Policy,
                        as: 'policyAssociation',
                        attributes: ['name', 'limit', 'co_pay', 'exclusions'],
                    }
                ],
            },
            {
                model: Region,
                as: 'regionAssociation',
                attributes: ['name'],
            }
        ],
    });
    //check if claims were found
    if (!claims || claims.length <= 0) {
        return next(new CustomError('No claims found', 404));
    }
    // Filter claims with status "paid"
    const paidClaims = claims.filter((claim) => claim.status === 'paid');

    // Fetch payments for all "paid" claims in a single query
    const payments = await Payment.findAll({
        where: {
            claim: paidClaims.map((claim) => claim.id),
        },
    });

    // Map payments to their respective claims
    const paymentMap = payments.reduce((map, payment) => {
        if (!map[payment.claim]) {
            map[payment.claim] = 0;
        }
        map[payment.claim] += parseFloat(payment.amount);
        return map;
    }, {});

    // Add reimbursement amount to paid claims
    const updatedClaims = claims.map((claim) => {
        if (claim.status === 'paid') {
            claim.dataValues.reimbursement = paymentMap[claim.id] || 0;
        }
        return claim;
    });

    //send response
    res.status(200).json(updatedClaims);
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
                    {
                        model: Policy,
                        as: 'policyAssociation',
                        attributes: ['name', 'limit', 'co_pay', 'exclusions'],
                    }
                ],
            },
            {
                model: Region,
                as: 'regionAssociation',
                attributes: ['name'],
            }
        ],
    });
    //check if claims were found
    if (!claims || claims.length <= 0) {
        return next(new CustomError('No claims found', 404));
    }
    //send response
    res.status(200).json(claims);
});
// Get all archived claims
const getAllArchivedClaims = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //get all claims
    const claims = await Claim.findAll({
        where:{
            closed: true,
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
                    {
                        model: Policy,
                        as: 'policyAssociation',
                        attributes: ['name', 'limit', 'co_pay', 'exclusions'],
                    }
                ],
            },
            {
                model: Region,
                as: 'regionAssociation',
                attributes: ['name'],
            }
        ],
    });
    //check if claims were found
    if (!claims || claims.length <= 0) {
        return next(new CustomError('No claims found', 404));
    }
    // Filter claims with status "paid"
    const paidClaims = claims.filter((claim) => claim.status === 'paid');

    // Fetch payments for all "paid" claims in a single query
    const payments = await Payment.findAll({
        where: {
            claim: paidClaims.map((claim) => claim.id),
        },
    });

    // Map payments to their respective claims
    const paymentMap = payments.reduce((map, payment) => {
        if (!map[payment.claim]) {
            map[payment.claim] = 0;
        }
        map[payment.claim] += parseFloat(payment.amount);
        return map;
    }, {});

    // Add reimbursement amount to paid claims
    const updatedClaims = claims.map((claim) => {
        if (claim.status === 'paid') {
            claim.dataValues.reimbursement = paymentMap[claim.id] || 0;
        }
        return claim;
    });

    //send response
    res.status(200).json(updatedClaims);
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
        return next(new CustomError('All fields are required', 400));
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
                status: {
                    [Op.or]: ['approved', 'paid'],
                },
                closed: false,
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
        console.log(totalPayment);
        
        //check if total payment has been paid
        if (totalPayment == claimToPay.claim_amount) {
            await transaction.rollback();
            return next(new CustomError('The full amount has already been paid', 400));
        }

        //check if total payment amount is greater than claim amount
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
            const paidClaim = await claimToPay.save({ transaction });
    
            if (!paidClaim) {
                await transaction.rollback();
                return next(new CustomError('Failed to pay claim', 500));
            }

            // Commit transaction
            await transaction.commit();

            // Send response
            return res.status(200).json({
                success: true,
                message: 'The full amount has been paid successfully',
            });
            
        }


        // Commit transaction
        await transaction.commit();

        // Send response
        res.status(200).json({
            success: true,
            message: 'Payment added successfully',
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
//client statistics
const getClientClaimStatistics = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //get all claims
    const claims = await Claim.findAll({
        where: {
            client: id,
        },
    });
    //check if claims were found
    if (!claims || claims.length <= 0) {
        return next(new CustomError('No claims found', 404));
    }
    // Filter claims with status "paid"
    const paidClaims = claims.filter((claim) => claim.status === 'paid');

    // Fetch payments for all "paid" claims in a single query
    const payments = await Payment.findAll({
        where: {
            claim: paidClaims.map((claim) => claim.id),
        },
    });

    // Map payments to their respective claims
    const paymentMap = payments.reduce((map, payment) => {
        if (!map[payment.claim]) {
            map[payment.claim] = 0;
        }
        map[payment.claim] += parseFloat(payment.amount);
        return map;
    }, {});

    // Add reimbursement amount to paid claims
    const updatedClaims = claims.map((claim) => {
        if (claim.status === 'paid') {
            claim.dataValues.reimbursement = paymentMap[claim.id] || 0;
        }
        return claim;
    });

    //calcuate statistics
    // Total number of claims
    const totalClaims = claims.length;
    // Total number of claims paid
    const totalPaidClaims = paidClaims.length;
    // Total number of claims rejected
    const totalRejectedClaims = claims.filter((claim) => claim.status === 'rejected').length;
    // Total number of claims pending
    const totalPendingClaims = claims.filter((claim) => claim.status === 'pending').length;
    // Total number of claims approved
    const totalApprovedClaims = claims.filter((claim) => claim.status === 'approved').length;
    // Total amount of claims 
    const totalClaimAmount = claims.reduce((sum, claim) => sum + parseFloat(claim.claim_amount), 0);
    // Total amount of claims approved and waiting for payment
    const ApprovedReimbursement = claims.filter((claim) => claim.status === 'approved');
    const totalApprovedReimbursementAmount = ApprovedReimbursement.reduce((sum, claim) => sum + parseFloat(claim.claim_amount), 0);
    // Total amount of claims paid and not closed
    const nonvalidatedPayments = payments.filter((payment) => payment.validation === false);
    const totalnonvalidatedReimbursement = nonvalidatedPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
    // Total validated payment of claims paid and not closed
    const validatedPayments = payments.filter((payment) => payment.validation === true);
    const totalvalidatedReimbursement = validatedPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

    //send response
    res.status(200).json({
        totalClaims,
        totalClaimAmount,
        totalPaidClaims,
        totalRejectedClaims,
        totalPendingClaims,
        totalApprovedClaims,
        totalApprovedReimbursementAmount,
        totalnonvalidatedReimbursement,
        totalvalidatedReimbursement,
    });
});
//claculate the total claims amount for the current year
const getTotalClaimsAmount = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //get all claims
    const claims = await Claim.findAll({
        where: {
            client: id,
            date: {
                [Op.gte]: new Date(new Date().getFullYear(), 0, 1),
            },
        },
    });    
    //check if claims were found
    if (!claims || claims.length <= 0) {
        return next(new CustomError('No claims found', 404));
    }
    // Total amount of claims 
    const totalClaimAmount = claims.reduce((sum, claim) => sum + parseFloat(claim.claim_amount), 0);
    //send response
    res.status(200).json(totalClaimAmount);
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
    getAllArchivedClaims,
    takeClaimByInsurer,
    rejectClaimByInsurer,
    addPaymentToClaimByInsurer,
    confirmPaymentByClient,
    getClientClaimStatistics,
    getTotalClaimsAmount,
}
