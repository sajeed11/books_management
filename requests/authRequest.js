import Joi from 'joi';

function registerRequestSchema() {
  return Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    role: Joi.string().valid('customer', 'admin', 'author').required().default('customer'),
    name: Joi.string().when('role', { is: 'author', then: Joi.required() }),
    biography: Joi.string().when('role', { is: 'author', then: Joi.required() }),
  });
}

function loginRequestSchema() {
  return Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  });
}

export { registerRequestSchema, loginRequestSchema };