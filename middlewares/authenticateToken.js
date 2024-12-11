const jwt = require('jsonwebtoken');
const appError = require('../utils/appError');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        next(appError.create('Unauthorized: Token is missing', 401, 'fail'));
        return;
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            next(appError.create("Forbidden: Invalid token", 403, 'fail'));
        }
        console.log(user);
        console.log(user.role);
        req.user = user;
    });
    next();
}

module.exports = authenticateToken;