import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import UserController from './user.controller';
import UserRepository from './user.repository';
import User, { UserSchema } from './user';
import UserService from './user.service';
import EmailverificationService from './emailVerification/email.verification.service';
import EmailVerificationRepository from './emailVerification/email.verification.repository';
import EmailVerification, {
    EmailverificationSchema,
} from './emailVerification/email.verification';
import EmailSender from 'src/config/email/email.sender';
import SecurityUtil from 'src/security/security.util';
import SecurityModule from 'src/security/security.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: EmailVerification.name, schema: EmailverificationSchema },
        ]),
        SecurityModule
    ],
    controllers: [UserController],
    providers: [
        // Services
        UserService,
        EmailverificationService,

        // Repositories
        UserRepository,
        EmailVerificationRepository,

        // Util
        EmailSender,
    ],
    exports: [UserService, UserRepository],
})
export default class UserModule {}
