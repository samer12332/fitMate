const appError = require("../utils/appError")

module.exports = (...roles) => {
    return (req, res, next) => {
        console.log(req.user.role);
        if(!roles.includes(req.user.role)) {
            next(appError.create('This role is not authorized', 401, 'fail'));
            return;
        }
        next();
    }
}