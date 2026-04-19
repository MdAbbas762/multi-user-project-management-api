const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

async function registerUser(req, res, next) {
    const { name, age, email, password, adminCode } = req.body;
    let role = 'user';

    try {
        const existingUser = await userModel.findOne({ email: email });

        if (existingUser) {
            throw new AppError('User already exists.', 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (adminCode && adminCode === process.env.ADMIN_SECRET) {
            role = 'admin';
        }

        const user = await userModel.create({
            name: name,
            age: age,   
            email: email,
            password: hashedPassword,
            role: role     
        });
        
        return res.status(201).json({
            success: true,
            message: 'User created successfully.',
            user: {
                id: user._id,
                name: user.name,
                age: user.age,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        return next(error);
    }
}


async function loginUser (req, res, next) {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email: email });

        if (!user) {
            throw new AppError('Invalid email or password.', 401);
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if(!isPasswordMatched) {
            throw new AppError('Invalid email or password.', 401);
        } 

        const payload = {
            id: user._id,
            role: user.role
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '30m'
        })

        return res.status(200).json({
            success: true,
            message: 'User logged in successfully.',
            token: token,
            user: {
                id: user._id,
                name: user.name,
                age: user.age,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        return next(error);
    }
} 

module.exports = {
    registerUser,
    loginUser
}