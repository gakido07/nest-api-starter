import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import JwtUtil from './auth/jwt/jwt.util';
import SecurityUtil from './security.util';

@Module({
    controllers: [],
    imports: [
        JwtModule.register({
            signOptions: {
                issuer: 'Nest Api Template',
                header: { alg: 'HS256', typ: 'JWT' },
            },
        }),
    ],
    providers: [JwtUtil, SecurityUtil],
    exports: [JwtUtil, SecurityUtil],
})
export default class SecurityModule {}
