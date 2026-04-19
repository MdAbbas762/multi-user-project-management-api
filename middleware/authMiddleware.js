const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

function authenticateUser(req, res, next) {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        return next(new AppError('Access token missing', 401));
    }

    const authHeaderParts = authHeader.split(' ');

    if (authHeaderParts[0].toLowerCase() !== 'bearer' || !authHeaderParts[1]) {
        return next(new AppError('Access token missing', 401));
    }

    const token = authHeaderParts[1];

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: data.id,
            role: data.role
        };

        next();
        
    } catch (error) {
        next(error);
    }
}

module.exports = authenticateUser;