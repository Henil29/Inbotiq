import Joi from "joi";

export const validateAdminUpdateUser = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).optional(),
        email: Joi.string().email().optional(),
        role: Joi.string().valid('user', 'admin').optional(),
    });

    return schema.validate(data);
};