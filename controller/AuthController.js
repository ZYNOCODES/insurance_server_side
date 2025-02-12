const sequelize = require('../config/Database.js');
const validator = require('validator');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const User = require('../model/UserModel.js');
const Region = require('../model/RegionModel.js');
const Client = require('../model/ClientModel.js');
const Insurer = require('../model/InsurerModel.js');
const MedicalService = require('../model/MedicalServiceModel.js');
const Admin = require('../model/AdminModel.js');
const Grade = require('../model/GradeModel.js');
const Policy = require('../model/PolicyModel.js');
const {
    createToken
} = require('../util/JWT.js');
const {
    comparePassword,
    hashPassword
} = require('../util/bcrypt.js');

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

// Client login
const ClientLogin = asyncErrorHandler(async (req, res, next) => {
    const {
        identifier,
        password
    } = req.body;

    if (!identifier || !password) {
        return next(new CustomError('All fields are required', 400));
    }
    // che
    let user;
    if (validator.isMobilePhone(identifier)) {
        user = await _findUserByPhone(identifier);
    } else {
        user = await _findUserByUsername(identifier);
    }
    // Check if the user exists
    if (!user) {
        return next(new CustomError('Invalid credentials', 401));
    }
    // Check if the password is correct
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        return next(new CustomError('Invalid credentials', 401));
    }
    //get infos from client
    const existingClient = await Client.findOne({
        where: {
            user: user.id
        },
        include: [
            {
                model: Policy,
                as: 'policyAssociation',
                attributes: ['name'],
            }
        ]
    });
    if (!existingClient) {
        return next(new CustomError('Invalid credentials', 401));
    }
    // Create and send token
    const token = createToken(
        existingClient.id,
        process.env.CLIENT_TYPE,
        user.region
    );

    res.status(200).json({
        success: true,
        token,
        infos: {
            username: user.username,
            phone: user.phone,
            fullName: user.fullname,
            region: user.regionAssociation.name,
            age: existingClient.age,
            address: existingClient.address,
            job: existingClient.job,
            married: existingClient.married,
            policy: existingClient.policyAssociation.name,
        }
    });
});

// Insurer login
const AdminInsurerLogin = asyncErrorHandler(async (req, res, next) => {
    const {
        identifier,
        password
    } = req.body;

    if (!identifier || !password) {
        return next(new CustomError('All fields are required', 400));
    }
    // che
    let user;
    if (validator.isMobilePhone(identifier)) {
        user = await _findUserByPhone(identifier);
    } else {
        user = await _findUserByUsername(identifier);
    }
    // Check if the user exists
    if (!user) {
        return next(new CustomError('Invalid credentials', 401));
    }
    // Check if the password is correct
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        return next(new CustomError('Invalid credentials', 401));
    }
    //check if user is admin or insurer
    const [existingAdmin, existingInsurer] = await Promise.all([
        Admin.findOne({
            where: {
                user: user.id
            }
        }),
        Insurer.findOne({
            where: {
                user: user.id
            },
            include: [
                {
                    model: Grade,
                    as: 'gradeAssociation',
                    attributes: ['name'],
                }
            ]
        })
    ]);
    
    if (!existingInsurer && !existingAdmin) {
        return next(new CustomError('Invalid credentials', 401));
    }
    // Create and send token
    const token = createToken(
        existingInsurer ? existingInsurer.id : existingAdmin.id,
        existingInsurer ? process.env.INSURER_TYPE : process.env.ADMIN_TYPE,
        user.region
    );

    res.status(200).json({
        success: true,
        token,
        infos: {
            username: user.username,
            phone: user.phone,
            fullName: user.fullname,
            region: user.regionAssociation.name,
            grade: existingInsurer ? existingInsurer.gradeAssociation.name : null,
        }
    });
});

// Admin login
const AdminLogin = asyncErrorHandler(async (req, res, next) => {
    const {
        identifier,
        password
    } = req.body;

    if (!identifier || !password) {
        return next(new CustomError('All fields are required', 400));
    }

    let user;
    if (validator.isMobilePhone(identifier)) {
        user = await _findUserByPhone(identifier);
    } else {
        user = await _findUserByUsername(identifier);
    }
    // Check if the user exists
    if (!user) {
        return next(new CustomError('Invalid credentials', 401));
    }
    
    // Check if the password is correct
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        return next(new CustomError('Invalid credentials', 401));
    }
    //get infos from admin
    const existingAdmin = await Admin.findOne({
        where: {
            user: user.id
        }
    });
    if (!existingAdmin) {
        return next(new CustomError('Invalid credentials', 401));
    }
    // Create and send token
    const token = createToken(
        existingAdmin.id,
        process.env.ADMIN_TYPE,
        user.region
    );

    res.status(200).json({
        success: true,
        token,
        infos: {
            username: user.username,
            phone: user.phone,
            fullName: user.fullname,
            region: user.regionAssociation.name,
        }
    });
});

// Medical service login
const MedicalServiceLogin = asyncErrorHandler(async (req, res, next) => {
    const {
        identifier,
        password
    } = req.body;

    if (!identifier || !password) {
        return next(new CustomError('All fields are required', 400));
    }

    let user;
    if (validator.isMobilePhone(identifier)) {
        user = await _findUserByPhone(identifier);
    } else {
        user = await _findUserByUsername(identifier);
    }
    // Check if the user exists
    if (!user) {
        return next(new CustomError('Invalid credentials', 401));
    }
    // Check if the password is correct
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        return next(new CustomError('Invalid credentials', 401));
    }
    //get infos from medical service
    const existingMedicalService = await MedicalService.findOne({
        where: {
            user: user.id
        }
    });
    if (!existingMedicalService) {
        return next(new CustomError('Invalid credentials', 401));
    }
    // Create and send token
    const token = createToken(
        existingMedicalService.id,
        process.env.MEDICALSERVICE_TYPE,
        user.region,
    );

    res.status(200).json({
        success: true,
        token,
        infos: {
            username: user.username,
            phone: user.phone,
            fullName: user.fullname,
            region: user.regionAssociation.name,
            type: existingMedicalService.type,
            location: existingMedicalService.location,
        }
    });
});

// Client register
const ClientRegister = asyncErrorHandler(async (req, res, next) => {
    const {
        username,
        password,
        phone,
        fullName,
        region,
        age,
        address,
        job,
        married,
        policy,
    } = req.body;

    if (!username || !password || !phone || !fullName || !region || !age || !job || !policy || married === undefined) {
        return next(new CustomError('All fields are required', 400));
    }
    // Check if the username an phone number and region and grade are valid
    const [usernameExists, phoneExists, regionExists, PolicyExists] = await Promise.all([
        _findUserByUsername(username),
        _findUserByPhone(phone),
        await Region.findByPk(region),
        await Policy.findByPk(policy),
    ]);
    if (usernameExists) {
        return next(new CustomError('A user with this username already exists', 400));
    }
    // Check if the phone number is already taken
    if (phoneExists) {
        return next(new CustomError('A user with this phone number already exists', 400));
    }
    // check if the region exists
    if (!regionExists) {
        return next(new CustomError('Invalid region', 400));
    }
    // check if the policy exists
    if (!PolicyExists) {
        return next(new CustomError('Invalid policy', 400));
    }
    // check if PolicyExists.name == Family Plan should have married == true
    if (PolicyExists.name === 'Family Plan' && married === false) {
        return next(new CustomError('You must be married to subscribe to the Family Plan', 400));
    }
    // Hash password
    const hashedPassword = await hashPassword(password);

    //start a transaction
    const transaction = await sequelize.transaction();
    try {
        // Create user
        const newUser = await User.create({
            username,
            password: hashedPassword,
            phone,
            fullname: fullName,
            region,
        }, {
            transaction
        });
        // Check if the user was created
        if (!newUser) {
            throw new CustomError('An error occurred, try again', 500);
        }
        // Create new client
        const newClient = await Client.create({
            user: newUser.id,
            age,
            address,
            job,
            married,
            policy,
        }, {
            transaction
        });
        // Check if the client was created
        if (!newClient) {
            throw new CustomError('An error occurred, try again', 500);
        }
        // Commit transaction
        await transaction.commit();
        res.status(200).json({
            success: true,
            message: 'Profile created successfully',
        });
    } catch (error) {
        // Rollback transaction
        await transaction.rollback();
        return next(new CustomError('An error occurred, try again', 500));
    }
});

// Insurer register
const InsurerRegister = asyncErrorHandler(async (req, res, next) => {
    const {
        username,
        password,
        phone,
        fullName,
        region,
        grade,
    } = req.body;

    if (!username || !password || !phone || !fullName || !region || !grade) {
        return next(new CustomError('All fields are required', 400));
    }
    // Check if the username an phone number and region and grade are valid
    const [usernameExists, phoneExists, regionExists, gradeExists] = await Promise.all([
        _findUserByUsername(username),
        _findUserByPhone(phone),
        await Region.findByPk(region),
        await Grade.findByPk(grade),
    ]);

    // Check if the username is already taken
    if (usernameExists) {
        return next(new CustomError('A user with this username already exists', 400));
    }
    // Check if the phone number is already taken
    if (phoneExists) {
        return next(new CustomError('A user with this phone number already exists', 400));
    }
    // check if the region exists
    if (!regionExists) {
        return next(new CustomError('Invalid region', 400));
    }
    // check if the grade exists
    if (!gradeExists) {
        return next(new CustomError('Invalid grade', 400));
    }
    // Hash password
    const hashedPassword = await hashPassword(password);

    //start a transaction
    const transaction = await sequelize.transaction();
    try {
        // Create user
        const newUser = await User.create({
            username,
            password: hashedPassword,
            phone,
            fullname: fullName,
            region,
        }, {
            transaction
        });
        // Check if the user was created
        if (!newUser) {
            throw new CustomError('An error occurred, try again', 500);
        }
        // Create new insurer
        const newInsurer = await Insurer.create({
            user: newUser.id,
            grade,
        }, {
            transaction
        });
        // Check if the insurer was created
        if (!newInsurer) {
            throw new CustomError('An error occurred, try again', 500);
        }
        // Commit transaction
        await transaction.commit();
        res.status(200).json({
            success: true,
            message: 'Insurer created successfully',
        });
    } catch (error) {
        // Rollback transaction
        await transaction.rollback();
        return next(new CustomError('An error occurred, try again', 500));
    }
});

// Admin register
const AdminRegister = asyncErrorHandler(async (req, res, next) => {
    const {
        username,
        password,
        phone,
        fullName,
        region,
    } = req.body;
    
    if (!username || !password || !phone || !fullName || !region) {
        return next(new CustomError('All fields are required', 400));
    }
    // Check if the username an phone number and region are valid
    const [usernameExists, phoneExists, regionExists] = await Promise.all([
        _findUserByUsername(username),
        _findUserByPhone(phone),
        await Region.findByPk(region),
    ]);    
    
    // Check if the username is already taken
    if (usernameExists) {
        return next(new CustomError('A user with this username already exists', 400));
    }
    // Check if the phone number is already taken
    if (phoneExists) {
        return next(new CustomError('A user with this phone number already exists', 400));
    }
    // check if the region exists
    if (!regionExists) {
        return next(new CustomError('Invalid region', 400));
    }
    // Hash password
    const hashedPassword = await hashPassword(password);

    //start a transaction
    const transaction = await sequelize.transaction();
    try {
        // Create user
        const newUser = await User.create({
            username,
            password: hashedPassword,
            phone,
            fullname: fullName,
            region,
        }, {
            transaction
        });
        // Check if the user was created
        if (!newUser) {
            throw new CustomError('An error occurred, try again', 500);
        }
        // Create new admin
        const newAdmin = await Admin.create({
            user: newUser.id,
        }, {
            transaction
        });
        // Check if the admin was created
        if (!newAdmin) {
            throw new CustomError('An error occurred, try again', 500);
        }
        // Commit transaction
        await transaction.commit();
        res.status(200).json({
            success: true,
            message: 'Admin created successfully',
        });
    } catch (error) {
        // Rollback transaction
        await transaction.rollback();
        return next(new CustomError('An error occurred, try again', 500));
    }
});

// Medical service register
const MedicalServiceRegister = asyncErrorHandler(async (req, res, next) => {
    const {
        username,
        password,
        phone,
        fullName,
        region,
        type,
        location,
    } = req.body;

    if (!username || !password || !phone || !fullName || !region || !type || !location) {
        return next(new CustomError('All fields are required', 400));
    }
    // Check if the type is valid 
    if (!['doctor', 'pharmacy', 'organisation'].includes(type)) {
        return next(new CustomError('Invalid type', 400));
    }
    // Check if the username an phone number and region are valid
    const [usernameExists, phoneExists, regionExists] = await Promise.all([
        _findUserByUsername(username),
        _findUserByPhone(phone),
        await Region.findByPk(region),
    ]);

    // Check if the username is already taken
    if (usernameExists) {
        return next(new CustomError('A user with this username already exists', 400));
    }
    // Check if the phone number is already taken
    if (phoneExists) {
        return next(new CustomError('A user with this phone number already exists', 400));
    }
    // check if the region exists
    if (!regionExists) {
        return next(new CustomError('Invalid region', 400));
    }
    // Hash password
    const hashedPassword = await hashPassword(password);

    //start a transaction
    const transaction = await sequelize.transaction();
    try {
        // Create user
        const newUser = await User.create({
            username,
            password: hashedPassword,
            phone,
            fullname: fullName,
            region,
        }, {
            transaction
        });
        // Check if the user was created
        if (!newUser) {
            throw new CustomError('An error occurred, try again', 500);
        }
        // Create new medical service
        const newMedicalService = await MedicalService.create({
            user: newUser.id,
            type,
            location,
        }, {
            transaction
        });
        // Check if the medical service was created
        if (!newMedicalService) {
            throw new CustomError('An error occurred, try again', 500);
        }
        // Commit transaction
        await transaction.commit();
        res.status(200).json({
            success: true,
            message: 'Medical service created successfully',
        });
    } catch (error) {
        // Rollback transaction
        await transaction.rollback();
        return next(new CustomError('An error occurred, try again', 500));
    }
});


module.exports = {
    ClientLogin,
    AdminInsurerLogin,
    AdminLogin,
    MedicalServiceLogin,
    ClientRegister,
    InsurerRegister,
    AdminRegister,
    MedicalServiceRegister
};
