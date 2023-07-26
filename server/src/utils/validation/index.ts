import Joi from 'joi';

export const signupSchema = Joi.object({
  username: Joi.string().alphanum().required(),
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().required(),
});

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});