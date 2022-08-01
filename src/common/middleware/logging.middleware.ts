import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);
  use(request: Request, response: Response, next: NextFunction) {
    response.on('finish', () => {
      this.logger.log(
        `request method=${request.method} url=${request.url} id=${randomUUID()} status=${
          response.statusCode
        }`
      );
    });
    next();
  }
}
