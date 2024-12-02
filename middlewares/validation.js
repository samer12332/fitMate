const appError = require('../utils/appError');
const {validationResult} = require('express-validator');

const validator = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        next(appError.create(errors.array(), 400, 'fail'));
        return;
    }
    next();
}

module.exports = {validator}