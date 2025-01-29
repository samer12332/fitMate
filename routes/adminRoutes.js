const express = require('express');
const router = express.Router();
const { getUsers, getUserByEmail, deleteUserByEmail } = require('../controllers/adminControllers');

const {asyncHandler} = require('../middlewares/wrapper');
const {validator} = require('../middlewares/validation');
const authenticateToken = require('../middlewares/authenticateToken');
const isTokenRevoked = require('../middlewares/isTokenRevoked');
const {userByEmailValidation} = require('../middlewares/validationArrays');

const allowedTo = require('../middlewares/allowedTo');



router.route('/dashboard/users').get(authenticateToken, isTokenRevoked, allowedTo('ADMIN'), asyncHandler(getUsers));

router.route('/dashboard/user').
all(authenticateToken, isTokenRevoked, userByEmailValidation, validator, allowedTo('ADMIN')).
get(asyncHandler(getUserByEmail))
.delete(asyncHandler(deleteUserByEmail));

module.exports = router;