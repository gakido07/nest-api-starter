import {
    ExecutionContext,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import jwt, { Jwt } from 'jsonwebtoken';
import { Request } from 'express';

import JwtUtil from '../jwt/jwt.util';
import { InvalidGuardForRouteException } from 'src/exception/auth.exceptions';
import SecurityUtil from 'src/security/security.util';
import { DecodeJwtError } from 'src/exception/jwt.exceptions';
import RouteGuard from 'src/security/auth/guards/interface/route.guard';

@Injectable()
export class UserRouteGuard extends AuthGuard('jwt') implements RouteGuard {
    private readonly logger = new Logger(UserRouteGuard.name);

    constructor(private jwtUtil: JwtUtil, private securityUtil: SecurityUtil) {
        super();
    }
    getUnauthorizedMessage(): string {
        return 'You seem lost';
    }

    getUrlSubRoute(): string {
        return 'user';
    }

    canActivate(context: ExecutionContext) {
        const request: Request = context.getArgByIndex(0);
        let token: string = null;

        try {
            token = request
                .header('Authorization')
                .substring(7, request.header('Authorization').length);
        } catch (error) {
            this.logger.error('Unable to extract jwt for request');
            throw new UnauthorizedException(this.getUnauthorizedMessage());
        }
        const routeUserId: string =
            this.securityUtil.extractUserIdFromUserRoute(
                request.url,
                this.getUrlSubRoute(),
            );

        const sub = this.jwtUtil.extractClaimFromToken(token, 'sub');
        const role = this.jwtUtil.extractClaimFromToken(token, 'role');

        if (role !== 'USER') {
            throw new UnauthorizedException(this.getUnauthorizedMessage());
        }
        if (sub.toString() !== routeUserId) {
            throw new UnauthorizedException(this.getUnauthorizedMessage());
        }

        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
