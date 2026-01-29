import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { PinoLoggerService } from './common/logger/logger.service';
import { setupValidation } from './config/validation.config';
import { setupCors } from './config/cors.config';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable NestJS shutdown hooks (SIGINT, SIGTERM)
  app.enableShutdownHooks();

  const configService = app.get(ConfigService);

  // Logger
  const logger = new PinoLoggerService(configService);
  app.useLogger(logger);

  // Global Pipes
  setupValidation(app);

  // CORS
  setupCors(app, configService);

  // Swagger
  setupSwagger(app, configService);

  const port = configService.get<number>('app.port') || 3000;
  const environment =
    configService.get<string>('app.environment') ?? 'development';

  await app.listen(port);

  console.log(`
      ╔════════════════════════════════════════════════════════════╗
      ║ 🚀 Portfolio Management System API                          ║
      ║ Environment: ${environment}                                ║
      ║ Version: ${configService.get<string>('app.version') ?? '1.0.0'} ║
      ║ Server: http://localhost:${port}                            ║
      ║ API Docs: http://localhost:${port}/api-docs                  ║
      ╚════════════════════════════════════════════════════════════╝
  `);

  logger.log(`🚀 Application started on port ${port}`, 'Bootstrap');
}

bootstrap().catch((error) => {
  console.error('❌ Failed to bootstrap application:', error);
  process.exit(1);
});
