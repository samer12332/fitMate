const User = require('../models/userModel');
const appError = require('../utils/appError');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const {generateAccessToken, generateRefreshToken} = require('../utils/generateJWT');
const { sendMail } = require('../services/mailService');
const { revokeAccessToken } = require('../utils/blacklist');



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

    await newUser.save();
    
    const html = `<p>Hi <strong>${username}</strong>,</p> 
        <p>Thank you for registering with <strong>[fitMate]</strong>.</p> 
        <p>Please use the following link to complete your registration:</p> 
        <p style="font-size: 18px; color: blue;"> 
            <a href="http://localhost:3000/api/auth/register/confirm/${registerationToken}" target="_blank">
                Complete Registration
            </a>
        </p> 
        <p>If you did not request this, please ignore this email.</p> 
        <p>Best regards,<br>fitMate</p>`;
    await sendMail(email, html);
    res.status(200).json({
        status: 'success',
        message: "Please, confirm your email",
        data: {
            user: newUser
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

    const accessToken = generateAccessToken({id: user._id, email: user.email, role: user.role, isConfirmed: true});
    const refreshToken = generateRefreshToken({id: user._id, email: user.email, role: user.role, isConfirmed: true});
    user.refreshToken = refreshToken;
    user.registerationToken = '';
    user.isConfirmed = true;
    await user.save();
    res.status(200).json({
        status: 'success',
        message: "Email is confirmed",
        data: {
            accessToken,
            refreshToken,
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

const redirect = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        next(appError.create('User not found', 404, 'fail'));
        return;
    }
    const accessToken = generateAccessToken({id: user._id, email: user.email, role: user.role, isConfirmed: true});
    const refreshToken = generateRefreshToken({id: user._id, email: user.email, role: user.role, isConfirmed: true});
    user.refreshToken = refreshToken;
    user.registerationToken = "";
    user.isConfirmed = true;
    await user.save();
    res.status(200).json({
        status: 'success',
        message: 'Authenticated successfully',
        data: {
            accessToken,
            refreshToken,
            user
        }
    });
}

const logout = async (req, res, next) => {
    const user = req.user;
    const dbUser = await User.findById(user.id);
    if (!user) {
        next(appError.create('User not found', 404, 'fail'));
        return;
    }
    req.user = null;
    dbUser.refreshToken = "";
    await dbUser.save();
    const token = req.headers.authorization.split(' ')[1];
    revokeAccessToken(token);
    res.status(200).json({
        status: 'success',
        message: 'logged out successfully',
        data: null
    });
}

const forgetPassword = async (req, res, next) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if (!user) {
        next(appError.create('Mail not found', 404, 'fail'));
        return;
    }
    const token = uuidv4();
    user.resetPasswordToken = token;
    await user.save();
    const html = `<div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; 
    border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center;">
            <h1>Password Reset Request</h1>
        </div>
        <div style="margin-top: 20px;">
            <p>Hi ${user.username},</p>
            <p>We received a request to reset your password. Click the button below to reset your password:</p>
            <a href="http://localhost:3000/api/auth/resetPassword/${token}" style="display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #007bff; border-radius: 5px; text-decoration: none;">Reset Password</a>
            <p>If you did not request a password reset, please ignore this email.</p>
        </div>
        <div style="margin-top: 20px; text-align: center; color: #777777;">
            <p>&copy; 2025 fit mate. All rights reserved.</p>
        </div>
    </div>`
    await sendMail(user.email, html);
    res.status(200).json({
        status: 'success',
        message: 'Password reset email sent. Check your inbox.',
        data: null
    });
}

const getResetPassword = async (req, res, next) => {
    const {token} = req.params;
    const user = await User.findOne({resetPasswordToken: token});
    if (!user) {
        next(appError.create('Invalid or expired password reset token.', 400, 'fail'));
        return;
    }
    res.status(200).json({
        status: 'success',
        message: 'Token is valid. Please proceed to reset your password.',
        data: null
    });
}

const postResetPassword = async(req, res, next) => {
    const {token} = req.params;
    const {newPassword} = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findOneAndUpdate({resetPasswordToken: token}, {password: hashedPassword, resetPasswordToken: ""}, {new: true});
    res.status(200).json({
        status: 'success',
        message: 'Your password has been reset successfully.',
        data: null
    });
}




module.exports = {
    register,
    refreshAccessToken,
    login,
    confirmEmail,
    redirect,
    logout,
    forgetPassword,
    getResetPassword,
    postResetPassword
}