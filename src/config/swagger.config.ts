import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupSwagger = (
  app: INestApplication,
  configService: ConfigService,
) => {
  /* ---------------------------------------------
   * App Metadata (Safe defaults)
   * --------------------------------------------- */
  const appName =
    configService.get<string>('app.name') ?? 'Portfolio Management API';

  const appVersion = configService.get<string>('app.version') ?? '1.0.0';

  const appDescription =
    configService.get<string>('app.description') ??
    'API for managing investment portfolios with JWT authentication, multi-asset support, and transaction tracking.';

  const developerName =
    configService.get<string>('app.developer.name') ?? 'Narayan Shaw';

  const developerEmail =
    configService.get<string>('app.developer.email') ?? 'nshaw.dev@gmail.com';

  const devServer =
    configService.get<string>('app.server.url') ?? 'http://localhost:3000';

  const stagingServer =
    configService.get<string>('app.server.staging') ??
    'https://staging.api.example.com';

  const prodServer =
    configService.get<string>('app.server.production') ??
    'https://api.example.com';

  /* ---------------------------------------------
   * Swagger Configuration
   * --------------------------------------------- */
  const swaggerConfig = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(
      `${appDescription}

        ### 🔐 Authentication
        - This API uses **JWT Bearer Authentication**
        - Add the token in the **Authorization** header:
        \`\`\`
        Authorization: Bearer <your_access_token>
        \`\`\`

        ### 📊 Features
        - Multi-portfolio support
        - Multi-asset investments
        - Transaction tracking
        - Real-time analytics
        `,
    )
    .setVersion(appVersion)

    /* ---------- Security ---------- */
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Paste your JWT access token here. Format: **Bearer &lt;token&gt;**',
      },
      'JWT-auth',
    )

    /* ---------- Global Tags ---------- */
    .addTag('Auth', 'Authentication & authorization')
    .addTag('User', 'User profile & account management')
    .addTag('Portfolio', 'Portfolio management')
    .addTag('Investment', 'Investment operations')
    .addTag('Transaction', 'Transaction history')
    .addTag('Dashboard', 'Analytics & insights')
    .addTag('Health', 'Health & system checks')

    /* ---------- Servers ---------- */
    .addServer(`${devServer}`, 'Development')
    .addServer(`${stagingServer}`, 'Staging')
    .addServer(`${prodServer}`, 'Production')

    /* ---------- Contact & Legal ---------- */
    .setContact(
      developerName,
      'https://github.com/DevNarayan95',
      developerEmail,
    )
    .setTermsOfService('https://example.com/terms')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')

    /* ---------- External Docs ---------- */
    .setExternalDoc(
      'Project Documentation',
      'https://devnarayan95.github.io/portfolio-management-docs/',
    )

    .build();

  /* ---------------------------------------------
   * Create Swagger Document
   * --------------------------------------------- */
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    deepScanRoutes: true,
  });

  /* ---------------------------------------------
   * Swagger UI Setup
   * --------------------------------------------- */
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
      filter: true,
      showRequestHeaders: true,
      docExpansion: 'none',
      defaultModelsExpandDepth: -1,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
    customSiteTitle: `${appName} – API Docs`,
  });
};
