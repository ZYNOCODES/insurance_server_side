const sequelize = require('../config/Database.js');
const { Op } = require('sequelize');
const validator = require('validator');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const Payment = require('../model/PaymentModel.js');
const Client = require('../model/ClientModel.js');
const Claim = require('../model/ClaimModel.js');
const Policy = require('../model/PolicyModel.js');

// pay a claim by insurer
const CreateNewPaymentToClaimByInsurer = asyncErrorHandler(async (req, res, next) => {
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

        //get client of the claim
        const existingClient = await Client.findOne({
            where: { 
                id: claimToPay.client 
            },
            include: {
                model: Policy,
                as: 'policyAssociation',
                select: ['co_pay']
            },
            transaction
        });

        let totalPayment = existingPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
        
        const amountToPay = (parseFloat(claimToPay.claim_amount) * parseFloat(existingClient.policyAssociation.co_pay)) / 100;
        
        //check if total payment has been paid
        if (totalPayment == parseFloat(amountToPay)) {
            await transaction.rollback();
            return next(new CustomError('The full amount has already been paid', 400));
        }

        //check if total payment amount is greater than claim amount
        if (totalPayment + parseFloat(amount) > parseFloat(amountToPay)) {
            await transaction.rollback();
            return next(new CustomError('Total payment amount cannot be greater than the amount needed to pay', 400));
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
        if (totalPayment + parseFloat(amount) == parseFloat(amountToPay)) {
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
        console.log(error);
        
        // Rollback transaction on error
        await transaction.rollback();
        next(new CustomError('An error occurred while processing the payment', 500));
    }
});
// display all payments by claim
const GetAllPaymentsByClaim = asyncErrorHandler(async (req, res, next) => {
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
                [Op.or]: ['approved', 'paid'],
            },
        }
    });
    // Check if claim exists
    if (!existingClaim) {
        return next(new CustomError('Claim not found', 404));
    }
    // Get all payments by claim
    const payments = await Payment.findAll({
        where: { claim: id },
    });
    // check if payments exist
    if (!payments || payments.length <= 0) {
        return next(new CustomError('No payments found', 404));
    }
    // Send response
    res.status(200).json(payments);
});
//validate payment by client
const ValidatePaymentByClient = asyncErrorHandler(async (req, res, next) => {
    const { payment } = req.body;
    // Check if all required fields are present
    if (!payment) {
        return next(new CustomError('Payment ID is required', 400));
    }
    // Check if payment exists
    const existingPayment = await Payment.findOne({
        where: {
            id: payment,
            validation: false,
        }
    });
    // Check if payment exists
    if (!existingPayment) {
        return next(new CustomError('Payment not found', 404));
    }
    // Check if client is the owner of the claim
    const claim = await Claim.findOne({
        where: {
            id: existingPayment.claim,
            client: req.user.id,
        }
    });
    if (!claim) {
        return next(new CustomError('You are not the owner of the claim', 403));
    }
    // Validate payment
    existingPayment.validation = true;
    const validatedPayment = await existingPayment.save();
    // Check if payment was validated
    if (!validatedPayment) {
        return next(new CustomError('Failed to validate payment', 500));
    }
    //if existingPayment is last validation then claim is closed
    const paymentsCount = await Payment.count({
        where: { claim: existingPayment.claim, validation: false },
    });
    if (paymentsCount === 0) {
        claim.closed = true;
        const closedClaim = await claim.save();
        if (!closedClaim) {
            return next(new CustomError('Failed to close claim', 500));
        }
    }
    // Send response
    res.status(200).json({
        success: true,
        message: 'Payment validated successfully',
    });
});

module.exports = {
    CreateNewPaymentToClaimByInsurer,
    GetAllPaymentsByClaim,
    ValidatePaymentByClient,
};
