const express = require('express');
const passport = require('passport');
const router = express.Router();
const { register, refreshAccessToken, login, confirmEmail, redirect, logout,
    forgetPassword, getResetPassword, postResetPassword } = require('../controllers/authController');

const {normalHandler, asyncHandler} = require('../middlewares/wrapper');
const {validator} = require('../middlewares/validation');
const authenticateToken = require('../middlewares/authenticateToken');
const isTokenRevoked = require('../middlewares/isTokenRevoked');
const {registerValidation, loginValidation, forgetPasswordValidation, resetPasswordValidation } = require('../middlewares/validationArrays');




router.route('/register')
.post(registerValidation, validator, asyncHandler(register));

router.route('/register/confirm/:token').get(asyncHandler(confirmEmail));

router.route('/token').post(normalHandler(refreshAccessToken));

router.route('/login').post(loginValidation, validator, asyncHandler(login));


router.route('/google').get(passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.route('/google/callback').get(passport.authenticate('google', {failureRedirect: '/login', session: false}), asyncHandler(redirect));

router.route('/facebook').get(passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
}));

router.route('/facebook/callback').get(passport.authenticate('facebook', {failureRedirect: '/login', session: false}),  asyncHandler(redirect));

router.route('/logout').post(authenticateToken, isTokenRevoked, asyncHandler(logout));

router.route('/resetPassword').post(forgetPasswordValidation, validator, asyncHandler(forgetPassword));

router.route('/resetPassword/:token').get(asyncHandler(getResetPassword))
.post(resetPasswordValidation, validator, asyncHandler(postResetPassword));



module.exports = router;


