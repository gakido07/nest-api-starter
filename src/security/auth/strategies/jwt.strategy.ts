import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { Request } from 'express';

import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    private readonly logger = new Logger(JwtStrategy.name);

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true,
            ignoreExpiration: false,
            secretOrKey: process.env.jwtSecret,
        });
    }

    async validate(request: Request, payload: jwt.JwtPayload) {
        return { id: payload.sub, email: payload.email };
    }
}
