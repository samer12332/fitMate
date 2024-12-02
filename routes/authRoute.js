const express = require('express');
const router = express.Router();
const { register, refreshAccessToken, login } = require('../controllers/authController');
const asyncHandler = require('../middlewares/asyncWrapper');
const { body } = require('express-validator');
const appError = require('../utils/appError');
const {validator} = require('../middlewares/validation');

router.route('/register')
.post([
    body('username').notEmpty().withMessage('Username is required')
    .isLength({min: 3}).withMessage('Username must be at least 3 characters long')
    .matches(/^[A-Za-z0-9]+$/).withMessage('Username can only contain letters and numbers'),
    body('email').notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email'),
    body('password').notEmpty().withMessage('password is required')
    .isLength({min: 8}).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase character')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase character')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[\w]/).withMessage('Password must contain at least one special character')
], validator, asyncHandler(register));

router.route('/token').post(asyncHandler(refreshAccessToken));

router.route('/login').post([
    body('email').notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email'),
    body('password').notEmpty().withMessage('password is required')
], validator, asyncHandler(login));

module.exports = router;


const userValidationRules = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
        .matches(/^[A-Za-z0-9]+$/).withMessage('Username can only contain letters and numbers'),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[\W]/).withMessage('Password must contain at least one special character')
];

