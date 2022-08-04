import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';

import { JwtStrategy } from './strategies/jwt.strategy';
import AuthController from './auth.controller';
import UserModule from 'src/user/user.module';
import AuthService from './auth.service';
import AdminModule from 'src/admin/admin.module';
import EmailSender from 'src/config/email/email.sender';
import VerificationModule from 'src/verification/verification.module';

@Module({
  imports: [PassportModule, UserModule, AdminModule, VerificationModule],
  providers: [AuthService, JwtStrategy, EmailSender],
  exports: [AuthService],
  controllers: [AuthController],
})
export default class AuthModule {}
