const { body } = require('express-validator');

const registerValidation = [
    body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
    .matches(/^[A-Za-z0-9\s]+$/).withMessage('Username can only contain letters, numbers, and spaces'),

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
];

const loginValidation = [
    body('email').notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email'),
    body('password').notEmpty().withMessage('password is required')
];

const forgetPasswordValidation = [
    body('email').notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email')
];

const resetPasswordValidation = [
    body('newPassword').notEmpty().withMessage('password is required')
    .isLength({min: 8}).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase character')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase character')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[\w]/).withMessage('Password must contain at least one special character'),

    body('confirmNewPassword').notEmpty().withMessage('Confirm password is required')
    .custom((value, {req}) => {
        if(value !== req.body.newPassword) {
            throw new Error('Passwords do not match');
        }
        return true;
    })
];

const infoValidation = [
    body('weight').isNumeric().withMessage('Weight must me a number')
    .notEmpty().withMessage('Weight is required')
    .isFloat({min: 30, max: 300}).withMessage('Weight must be between 30 and 300 kg'),

    body('height').isNumeric().withMessage('Height must me a number')
    .notEmpty().withMessage('Height is required')
    .isFloat({min: 100, max: 250}).withMessage('Height must be between 100 and 250 cm'),

    body('age').isNumeric().withMessage('Age must me a number')
    .notEmpty().withMessage('Age is required')
    .isFloat({min: 10, max: 120}).withMessage('Age must be between 10 and 120 years'),

    body('foodDislikes')
    .optional()
    .isArray().withMessage('Food dislikes must be an array'),

    body('trainRate').isIn(['none', 'light', 'moderate', 'intense', 'extreme']).withMessage('Invalid training rate')
    .notEmpty().withMessage('Training rate is required'),

    body('budget').isIn(['low', 'medium', 'high']).withMessage('Budget must be one of: low, medium, high')
    .notEmpty().withMessage('Budget is required'),

    body('trainingPlace').isIn(['home', 'gym', 'none']).withMessage('Invalid training place')
    .notEmpty().withMessage('Training place is required')
]

const goalsValidation = [
    body('goal').isIn(['cardio', 'diet', 'bulk fast', 'clean bulk', 'maintain weight cutting', 'maintain weight keep'])
    .withMessage('Invalid goal')
    .notEmpty().withMessage('Goal is required')
]

const activityValidation = [
    body('activityLevel').isIn(['none', 'light', 'moderate', 'intense', 'extreme']).withMessage('Invalid activity level')
    .notEmpty().withMessage('activity level is required')
]

const userByEmailValidation = [
    body('email').notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email')
]

module.exports = {
    registerValidation,
    loginValidation,
    forgetPasswordValidation,
    resetPasswordValidation,
    infoValidation,
    activityValidation,
    goalsValidation,
    userByEmailValidation
}