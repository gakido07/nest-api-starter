import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import UserModule from 'src/user/user.module';
import Admin, { AdminSchema } from './admin';
import AdminController from './admin.controller';
import AdminRepository from './admin.repository';
import AdminService from './admin.service';
import SecurityUtil from 'src/security/util/security.util';
import JwtUtil from 'src/security/util/jwt.util';
import VerificationModule from 'src/verification/verification.module';
import EmailSender from 'src/config/email/email.sender';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    UserModule,
    JwtModule.register({
      signOptions: {
        issuer: 'Nest Api Template',
        header: { alg: 'HS256', typ: 'JWT' },
      },
    }),
    VerificationModule,
  ],
  providers: [AdminService, AdminRepository, EmailSender, SecurityUtil, JwtUtil],
  controllers: [AdminController],
  exports: [AdminService],
})
export default class AdminModule {}
