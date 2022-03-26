import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import EmailSender from 'src/config/email/email.sender';
import SecurityModule from 'src/security/security.module';
import EmailVerification, {
    EmailverificationSchema,
} from 'src/user/emailVerification/email.verification';
import EmailVerificationRepository from 'src/user/emailVerification/email.verification.repository';
import EmailverificationService from 'src/user/emailVerification/email.verification.service';
import UserModule from 'src/user/user.module';
import Admin, { AdminSchema } from './admin';
import AdminController from './admin.controller';
import AdminRepository from './admin.repository';
import AdminService from './admin.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Admin.name, schema: AdminSchema },
            { name: EmailVerification.name, schema: EmailverificationSchema },
        ]),
        SecurityModule,
        UserModule
    ],
    providers: [
        AdminService,
        EmailverificationService,

        AdminRepository,
        EmailVerificationRepository,

        EmailSender,
    ],
    controllers: [AdminController],
    exports: [AdminService],
})
export class AdminModule {}
