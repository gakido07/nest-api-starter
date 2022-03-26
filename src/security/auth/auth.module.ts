import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { JwtStrategy } from './strategies/jwt.strategy';
import AuthController from './auth.controller';
import UserModule from 'src/user/user.module';
import AuthService from './auth.service';
import SecurityModule from '../security.module';
import { AdminModule } from 'src/admin/admin.module';
import EmailVerificationRepository from 'src/user/emailVerification/email.verification.repository';
import EmailverificationService from 'src/user/emailVerification/email.verification.service';
import EmailVerification, { EmailverificationSchema } from 'src/user/emailVerification/email.verification';
import EmailSenderImpl from 'src/config/email/email.sender';

@Module({
    imports: [PassportModule, 
        UserModule, 
        SecurityModule,
        AdminModule,
        MongooseModule.forFeature([
            { name: EmailVerification.name, schema: EmailverificationSchema },
        ]),
    ],
    providers: [
        AuthService, 
        JwtStrategy,
        EmailVerificationRepository,
        EmailverificationService,
        EmailSenderImpl
    ],
    exports: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
