function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;

    console.log(`An unexpected error occured:\n${err}`);

    if (err.isOperational) {
        if (err.issues?.length > 0) {
            return res.status(statusCode).json({
                success: false,
                message: err.message,
                issues: err.issues
            });
        }

        return res.status(statusCode).json({
            success: false,
            message: err.message
        });
    }

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid or missing token.'
        });
    }

    return res.status(statusCode).json({
        success: false,
        message: 'Something went wrong.'
    });
}

module.exports = errorHandler;