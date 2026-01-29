import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const setupCors = (
  app: INestApplication,
  configService: ConfigService,
) => {
  app.enableCors({
    origin: configService.get<string>('app.cors.origin'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
};
