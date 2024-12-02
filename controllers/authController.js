const User = require('../models/userModel');
const appError = require('../utils/appError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateAccessToken, generateRefreshToken} = require('../utils/generateJWT');



const register = async (req, res, next) => {
    const { username, email, password } = req.body;
    const user = await User.findOne({email});
    if (user) {
        next(appError.create('Email already exists', 409, 'fail'));
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });
    const accessToken = generateAccessToken({email: newUser.email, id: newUser._id});
    const refreshToken = generateRefreshToken({email: newUser.email, id: newUser._id});
    newUser.refreshToken = refreshToken;
    await newUser.save();
    res.status(200).json({
        status: 'success',
        message: "User registered successfully",
        data: {
            user: newUser,
            accessToken,
            refreshToken
        }
    });
}

const refreshAccessToken = async (req, res, next) => {
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
        const accessToken = generateAccessToken({email: user.email, id: user._id});
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
    const accessToken = generateAccessToken({email: user.email, id: user._id});
    const refreshToken = generateRefreshToken({email: user.email, id: user._id});
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
    login
}