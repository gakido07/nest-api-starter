import {
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';

import { AdminDocument } from 'src/admin/admin';
import { InvalidRefreshToken } from 'src/exception/auth.exceptions';
import { DecodeJwtError } from 'src/exception/jwt.exceptions';
import { UserDocument } from '../../../user/user';

type AppUserDocument = AdminDocument | UserDocument;

@Injectable()
export default class JwtUtil {

    private readonly logger: Logger = new Logger(JwtUtil.name);

    constructor(private jwtService: JwtService) {}

    generateJwt<T extends AppUserDocument>(appUser: T): string {
        return this.jwtService.sign(
            { ...new Claims(appUser) },
            { secret: process.env.jwtSecret, expiresIn: '300s' },
        );
    }

    generateRefreshToken<T extends AppUserDocument>(
        appUser: T,
    ): { refreshToken: string; jti: string } {
        const tokenId = randomUUID();
        return {
            refreshToken: this.jwtService.sign(
                { sub: appUser.id },
                {
                    secret: process.env.refreshTokenSecret,
                    jwtid: tokenId,
                    expiresIn: '30000s',
                },
            ),
            jti: tokenId,
        };
    }

    decodeJwt(token: string): string | jwt.JwtPayload {
        return this.jwtService.decode(token);
    }

    verifyJwt(token: string): Claims<UserDocument> {
        let claims: Claims<UserDocument> = null; 
        try {
            claims = this.jwtService.verify<Claims<UserDocument>>(token, {
                secret: process.env.refreshTokenSecret
            });
        }
        catch (error) {
            this.logger.error(error.message);
            throw new HttpException("Error while verifying refresh token", HttpStatus.CONFLICT);
        }
        return claims;
    }

    extractClaimFromToken(token: string, tokenClaim: string): string {
        const jwtPayload: string | jwt.JwtPayload = this.decodeJwt(token);

        // This checks if the decode function above returns a valid jwt payload
        if (!jwtPayload?.sub) {
            throw new DecodeJwtError('Invalid token');
        }

        const claim: string = jwtPayload[`${tokenClaim}`];

        if (!claim) {
            throw new HttpException(
                'invalid claim',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
        return claim;
    }
}

export class Claims<T extends AppUserDocument> {
    sub: string;
    email: string;
    role: string;
    jti?: string;

    constructor(appUser: T) {
        this.sub = appUser.id;
        this.email = appUser.email;
        this.role = appUser.getRole();
    }
}
