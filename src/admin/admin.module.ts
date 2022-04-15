import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';


import EmailSender from 'src/config/email/email.sender';
import Verification, {
    VerificationSchema,
} from 'src/user/verification/verification';
import VerificationRepository from 'src/user/verification/verification.repository';
import VerificationService from 'src/user/verification/verification.service';
import UserModule from 'src/user/user.module';
import Admin, { AdminSchema } from './admin';
import AdminController from './admin.controller';
import AdminRepository from './admin.repository';
import AdminService from './admin.service';
import SecurityUtil from 'src/security/util/security.util';
import JwtUtil from 'src/security/util/jwt.util';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Admin.name, schema: AdminSchema },
            { name: Verification.name, schema: VerificationSchema },
        ]),
        UserModule,
        JwtModule.register({
            signOptions: {
                issuer: 'Nest Api Template',
                header: { alg: 'HS256', typ: 'JWT' },
            },
        })
    ],
    providers: [
        AdminService,
        VerificationService,

        AdminRepository,
        VerificationRepository,

        EmailSender,
        SecurityUtil,
        JwtUtil,
    ],
    controllers: [AdminController],
    exports: [AdminService],
})
export default class AdminModule {}
