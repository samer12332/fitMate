const express = require('express');
const router = express.Router();
const { register, refreshAccessToken, login, confirmEmail } = require('../controllers/authController');
const {normalHandler, asyncHandler} = require('../middlewares/wrapper');
const { body } = require('express-validator');
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
    .matches(/[\w]/).withMessage('Password must contain at least one special character'),

    body('confirmPassword').notEmpty().withMessage('Confirm password is required')
    .custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    })
], validator, asyncHandler(register));

router.route('/register/confirm/:token').get(asyncHandler(confirmEmail));

router.route('/token').post(normalHandler(refreshAccessToken));

router.route('/login').post([
    body('email').notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email'),
    body('password').notEmpty().withMessage('password is required')
], validator, asyncHandler(login));

module.exports = router;


