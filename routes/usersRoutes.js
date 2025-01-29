const express = require('express');
const router = express.Router();
const {postInformation, postGoal, postActivityLevel} = require('../controllers/usersController');

const {asyncHandler} = require('../middlewares/wrapper');
const {validator} = require('../middlewares/validation');
const authenticateToken = require('../middlewares/authenticateToken');
const {infoValidation, goalsValidation, activityValidation} = require('../middlewares/validationArrays');

const isConfirmed = require('../middlewares/isConfirmed');

router.route('/info').put(authenticateToken, isConfirmed, infoValidation, validator, asyncHandler(postInformation));

router.route('/goal').put(authenticateToken, isConfirmed, goalsValidation, validator, asyncHandler(postGoal));

router.route('/activityLevel').put(authenticateToken, isConfirmed, activityValidation, validator, asyncHandler(postActivityLevel));

module.exports = router;