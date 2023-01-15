import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import JwtUtil from '../../util/jwt.util';
import SecurityUtil from 'src/security/util/security.util';

@Injectable()
export default class UserRouteGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(UserRouteGuard.name);

  constructor(private jwtUtil: JwtUtil, private securityUtil: SecurityUtil) {
    super();
  }

  private unauthorizedMessage = 'You are unauthorized to access this endpoint';

  canActivate(context: ExecutionContext) {
    const request: Request = context.getArgByIndex(0);
    let token: string = null;

    try {
      token = request.header('Authorization').substring(7, request.header('Authorization').length);
    } catch (error) {
      this.logger.error('Unable to extract jwt for request');
      throw new UnauthorizedException(this.unauthorizedMessage);
    }
    const role = this.jwtUtil.extractClaimFromToken(token, 'role');
    if (role !== 'USER') {
      throw new UnauthorizedException(this.unauthorizedMessage);
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
