const User = require('../models/userModel');
const appError = require('../utils/appError');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const {generateAccessToken, generateRefreshToken} = require('../utils/generateJWT');
const { sendMail } = require('../services/mailService');



const register = async (req, res, next) => {
    const { username, email, password } = req.body;
    const user = await User.findOne({email});
    if (user) {
        next(appError.create('Email already exists', 409, 'fail'));
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const registerationToken = uuidv4()
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        registerationToken
    });
    const accessToken = generateAccessToken({id: newUser._id, email: newUser.email, role: newUser.role, isConfirmed: newUser.isConfirmed});
    const refreshToken = generateRefreshToken({id: newUser._id, email: newUser.email, role: newUser.role, isConfirmed: newUser.isConfirmed});
    newUser.refreshToken = refreshToken;
    await newUser.save();
    await sendMail(username, email, registerationToken);
    res.status(200).json({
        status: 'success',
        message: "Please, confirm your email",
        data: {
            user: newUser,
            accessToken,
            refreshToken
        }
    });
}
const confirmEmail = async (req, res, next) => {
    const token = req.params.token;
    const user = await User.findOne({registerationToken: token});
    if (!user) {
        next(appError.create('Token is incorrect', 400, 'fail'));
        return;
    }
    user.registerationToken = '';
    user.isConfirmed = true;
    await user.save();
    res.status(200).json({
        status: 'success',
        message: "Email is confirmed",
        data: {
            user
        }
    })
}

const refreshAccessToken = (req, res, next) => {
    const { token } = req.body;
    if (!token) {
        next(appError.create('Unauthorized: Token is missing', 401, 'fail'));
        return;
    }
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            next(appError.create("Forbidden: Invalid token", 403, 'fail'));
            return;
        }
        const accessToken = generateAccessToken({id: user._id, email: user.email, role: user.role, isConfirmed: user.isConfirmed});
        res.status(200).json({
            status: 'success',
            message: "New access token generated successfully",
            data: {
                accessToken
            }
        })
    })
}

const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if (!user) {
        next(appError.create('Email not found', 404, 'fail'));
        return;
    }
    const isSamePassword = await bcrypt.compare(password, user.password);
    if(!isSamePassword) {
        next(appError.create('Incorrect password', 401, 'fail'));
        return;
    }
    if(!user.isConfirmed) {
        next(appError.create('Your email is not confirmed. Please check your email for the confirmation link.', 403, 'fail'));
        return;
    }
    const accessToken = generateAccessToken({id: user._id, email: user.email, role: user.role, isConfirmed: user.isConfirmed});
    const refreshToken = generateRefreshToken({id: user._id, email: user.email, role: user.role, isConfirmed: user.isConfirmed});
    user.refreshToken = refreshToken;
    await user.save();
    res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
            accessToken,
            refreshToken
        }
    });
}




module.exports = {
    register,
    refreshAccessToken,
    login,
    confirmEmail
}