import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { InvalidGuardForRouteException } from 'src/exception/auth.exceptions';

interface PasswordEncoder {
    encode(rawPassword: string): Promise<string>;
    match(rawPassword: string, hash: string): Promise<boolean>;
}

@Injectable()
export default class SecurityUtil {
    // This file is left for possible grouping of all security utility functions like password encoder etc.

    passwordEncoder(): PasswordEncoder {
        return {
            encode: async (rawPassword: string): Promise<string> =>
                await hash(rawPassword, 12),
            match: async (
                rawPassword: string,
                hash: string,
            ): Promise<boolean> => await compare(rawPassword, hash),
        };
    }

    extractUserIdFromUserRoute(url: string, urlSubRoute: string): string {
        if (!url.includes(urlSubRoute)) {
            throw new HttpException('Invalid argument', HttpStatus.CONFLICT);
        }
        return url.split('/', 3)[2];
    }
}
