import { ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export default interface SubRouteGuard {
    getUnauthorizedMessage(): string;

    getUrlSubRoute(): string;

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean>;

    handleRequest(err, user, info): any;
}
