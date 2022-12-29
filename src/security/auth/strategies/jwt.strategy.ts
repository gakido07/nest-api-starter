import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import jwt from 'jsonwebtoken';

import { ExtractJwt, Strategy } from 'passport-jwt';
import JwtUtil, { AppUserDocument, Claims } from 'src/security/util/jwt.util';
import { CustomRequestContext } from 'src/config/types';
import { extractTokenFromAuthHeader } from 'src/common/util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private jwtUtil: JwtUtil) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      ignoreExpiration: false,
      secretOrKey: process.env.jwtSecret,
    });
  }

  async validate(
    request: CustomRequestContext,
    payload: jwt.JwtPayload
  ): Promise<Claims<AppUserDocument>> {
    const token = extractTokenFromAuthHeader(request.header('Authorization'));
    request.claims = {
      ...this.jwtUtil.extractAllClaimsFromToken(token),
    };
    return { sub: payload.sub, email: payload.email, role: payload.role };
  }
}
