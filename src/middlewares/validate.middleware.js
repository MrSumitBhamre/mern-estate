

const apiResponse = require('../utils/apiResponse.util');

module.exports = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,   // return all validation errors
            stripUnknown: true   // remove unknown fields
        });

        if (error) {
            return apiResponse.error(
                res,
                400,
                error.details.map((d) => d.message).join(', ')
            );
        }

        next();
    };
};
