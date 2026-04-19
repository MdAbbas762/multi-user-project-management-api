class appError extends Error {
    constructor (message, statusCode, issues = []) {
        super(message);
        this.statusCode = statusCode;
        this.issues = [...issues];
        this.isOperational = true;
    }
}

module.exports = appError;