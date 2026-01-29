import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

  APP_NAME: Joi.string().default('Portfolio Management System'),
  APP_VERSION: Joi.string().default('1.0.0'),
  APP_DESCRIPTION: Joi.string().default(
    'API for managing investment portfolios with JWT authentication, multi-asset support, and transaction tracking.',
  ),
  APP_SERVER_URL: Joi.string().uri().default('http://localhost:3000'),

  APP_DEVELOPER_NAME: Joi.string().default('Narayan Shaw'),
  APP_DEVELOPER_EMAIL: Joi.string().email().default('nshaw.dev@gmail.com'),

  PORT: Joi.number().default(3000),
  CORS_ORIGIN: Joi.string().default('http://localhost:3001'),

  DATABASE_URL: Joi.string().required().messages({
    'any.required': 'DATABASE_URL environment variable is required',
  }),

  JWT_SECRET: Joi.string().required().min(32),
  JWT_EXPIRATION: Joi.string().default('24h'),
  JWT_REFRESH_SECRET: Joi.string().required().min(32),
  JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),

  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug', 'trace').default('debug'),
  LOG_DIR: Joi.string().default('./logs'),
});
