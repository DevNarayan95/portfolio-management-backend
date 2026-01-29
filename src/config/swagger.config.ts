import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication, configService: ConfigService) => {
  // Fetch config values safely with default fallbacks
  const appName = configService.get<string>('app.name') ?? 'Portfolio Management API';
  const appVersion = configService.get<string>('app.version') ?? '1.0.0';
  const appDescription =
    configService.get<string>('app.description') ??
    'API for managing investment portfolios with JWT authentication, multi-asset support, and transaction tracking.';
  const serverUrl = configService.get<string>('app.server.url') ?? 'http://localhost:3000';
  const developerName = configService.get<string>('app.developer.name') ?? 'Narayan Shaw';
  const developerEmail = configService.get<string>('app.developer.email') ?? 'nshaw.dev@gmail.com';

  const swaggerConfig = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(appDescription)
    .setVersion(appVersion)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentication and authorization endpoints')
    .addTag('Portfolio', 'Portfolio management endpoints')
    .addTag('Investment', 'Investment management endpoints')
    .addTag('Transaction', 'Transaction history endpoints')
    .addTag('Dashboard', 'Dashboard and analytics endpoints')
    .setContact(developerName, '', developerEmail)
    .addServer(serverUrl, 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
      filter: true,
      showRequestHeaders: true,
    },
  });
};
