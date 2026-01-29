import { Injectable, LoggerService } from '@nestjs/common';
import pino from 'pino';
import * as path from 'path';
import { mkdirSync } from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PinoLoggerService implements LoggerService {
  private logger: pino.Logger;
  private logDir: string;
  private logLevel: string;

  constructor(private configService: ConfigService) {
    // Read env
    this.logDir = this.configService.get<string>('app.logging.directory') || './logs';
    this.logLevel = this.configService.get<string>('app.logging.level') || 'debug';

    // Initialize logger immediately
    this.logger = this.initializeLogger();
  }

  private initializeLogger(): pino.Logger {
    try {
      mkdirSync(this.logDir, { recursive: true });
    } catch (err) {
      console.error('Failed to create log directory:', err);
    }

    const logFile = path.join(this.logDir, 'app.log');

    // Multistream: file + console
    const fileStream = pino.destination({ dest: logFile, sync: false });
    const prettyStream = pino.transport({
      target: 'pino-pretty',
      options: {
        colorize: true,
        singleLine: false,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    });

    return pino(
      {
        level: this.logLevel,
        base: {
          service: this.configService.get<string>('app.name') || 'portfolio-api',
        },
      },
      pino.multistream([{ stream: fileStream }, { stream: prettyStream }]),
    );
  }

  log(message: string, context?: string): void {
    this.logger.info({ context }, message);
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error({ context, trace }, message);
  }

  warn(message: string, context?: string): void {
    this.logger.warn({ context }, message);
  }

  debug(message: string, context?: string): void {
    this.logger.debug({ context }, message);
  }

  verbose(message: string, context?: string): void {
    this.logger.trace({ context }, message);
  }
}
