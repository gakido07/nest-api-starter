import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import JwtUtil from './util/jwt.util';
import SecurityUtil from './util/security.util';

@Global()
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
