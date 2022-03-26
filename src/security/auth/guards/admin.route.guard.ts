import {
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

import { DecodeJwtError } from 'src/exception/jwt.exceptions';
import SubRouteGuard from 'src/security/auth/guards/interface/route.guard';
import JwtUtil from '../jwt/jwt.util';
import SecurityUtil from 'src/security/security.util';

@Injectable()
export class AdminRouteGuard extends AuthGuard('jwt') implements SubRouteGuard {
    private readonly logger = new Logger(AdminRouteGuard.name);

    constructor(private jwtUtil: JwtUtil, private securityUtil: SecurityUtil) {
        super();
    }

    getUrlSubRoute(): string {
        return 'admin';
    }

    getUnauthorizedMessage(): string {
        return 'You seem lost';
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

        if (role !== 'ADMIN') {
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
