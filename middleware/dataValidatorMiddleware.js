const AppError = require("../utils/AppError");

function validator (schema) {
    return (req, res, next) => {
        if (schema.body) {
            const result = schema.body.safeParse(req.body);

            if (!result.success) {
                throw new AppError('Validation failed', 400, result.error.issues);
            } 
        } 

        if (schema.params) {
            const result = schema.params.safeParse(req.params);

            if (!result.success) {
                throw new AppError('Validation failed', 400, result.error.issues);
            } 
        }

        next();
    }
}

module.exports = validator;