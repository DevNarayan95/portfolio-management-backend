import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'Portfolio Management System',
  version: process.env.APP_VERSION || '1.0.0',
  description:
    process.env.APP_DESCRIPTION ||
    'API for managing investment portfolios with JWT authentication, multi-asset support, and transaction tracking.',
  server: {
    url: process.env.APP_SERVER_URL || 'http://localhost:3000',
  },
  developer: {
    name: process.env.APP_DEVELOPER_NAME || 'Narayan Shaw',
    email: process.env.APP_DEVELOPER_EMAIL || 'nshaw.dev@gmail.com',
  },
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  },

  database: {
    url: process.env.DATABASE_URL!,
  },

  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRATION || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },

  logging: {
    level: (process.env.LOG_LEVEL || 'debug') as 'error' | 'warn' | 'info' | 'debug' | 'trace',
    directory: process.env.LOG_DIR || './logs',
  },
}));
