import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { JwtStrategy } from './strategies/jwt.strategy';
import AuthController from './auth.controller';
import UserModule from 'src/user/user.module';
import AuthService from './auth.service';
import AdminModule from 'src/admin/admin.module';
import VerificationRepository from 'src/user/verification/verification.repository';
import VerificationService from 'src/user/verification/verification.service';
import Verification, { VerificationSchema } from 'src/user/verification/verification';
import EmailSenderImpl from 'src/config/email/email.sender';

@Module({
    imports: [
        PassportModule, 
        UserModule, 
        AdminModule,
        MongooseModule.forFeature([
            { name: Verification.name, schema: VerificationSchema },
        ]),
    ],
    providers: [
        AuthService,
        JwtStrategy,
        VerificationRepository,
        VerificationService,
        EmailSenderImpl,
    ],
    exports: [AuthService],
    controllers: [AuthController],
})
export default class AuthModule {}
