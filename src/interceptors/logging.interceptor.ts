import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly requestMethods: string[] = ['PUT', 'PATCH', 'POST'];

    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> {
        const request: Request = context.getArgByIndex(0);
        const response: Response = context.getArgByIndex(1);

        this.logger.log(
            `${request.method} request made to {url:${request.url}}`,
        );
        this.logger.log(`Response status: ${response.statusCode.toString()}`);

        return next.handle().pipe(tap());
    }
}
