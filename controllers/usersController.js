const User = require('../models/userModel');
const appError = require('../utils/appError');


const postInformation = async (req, res, next) => {
    const info = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
        next(appError.create('User not found', 404, 'fail'));
        return;
    }
    user.info = info;
    await user.save();
    res.status(200).json({
        status: 'success',
        message: 'User information saved successfully',
        data: user.info
    });
}

const postGoal = async (req, res, next) => {
    const {goal} = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
        next(appError.create('User not found', 404, 'fail'));
        return;
    }
    user.goal = goal;
    await user.save();
    res.status(200).json({
        status: 'success',
        message: 'Goal saved successfully',
        data: user.goal
    });
}

const postActivityLevel = async (req, res, next) => {
    const {activityLevel} = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
        next(appError.create('User not found', 404, 'fail'));
        return;
    }
    user.activityLevel = activityLevel;
    await user.save();
    res.status(200).json({
        status: 'success',
        message: 'Activity level saved successfully',
        data: user.activityLevel
    });
}

module.exports = {
    postInformation, 
    postGoal,
    postActivityLevel
}