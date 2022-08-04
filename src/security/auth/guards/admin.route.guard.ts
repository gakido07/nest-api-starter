import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import JwtUtil from '../../util/jwt.util';

@Injectable()
export default class AdminRouteGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(AdminRouteGuard.name);

  constructor(private jwtUtil: JwtUtil) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request: Request = context.getArgByIndex(0);
    let token: string = null;

    try {
      token = request.header('Authorization').substring(7, request.header('Authorization').length);
    } catch (error) {
      this.logger.error('Unable to extract jwt for request');
      throw new UnauthorizedException('You seem lost');
    }

    const sub = this.jwtUtil.extractClaimFromToken(token, 'sub');
    const role = this.jwtUtil.extractClaimFromToken(token, 'role');

    if (!['ADMIN', 'SUPER_ADMIN'].includes(role)) {
      throw new UnauthorizedException('You seem lost');
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
