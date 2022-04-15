import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import UserController from './user.controller';
import UserRepository from './user.repository';
import User, { UserSchema } from './user';
import UserService from './user.service';
import VerificationService from './verification/verification.service';
import VerificationRepository from './verification/verification.repository';
import Verification, {
    VerificationSchema,
} from './verification/verification';
import EmailSender from 'src/config/email/email.sender';
import SecurityUtil from 'src/security/util/security.util';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Verification.name, schema: VerificationSchema },
        ]),
    ],
    controllers: [UserController],
    providers: [
        // Services
        UserService,
        VerificationService,

        // Repositories
        UserRepository,
        VerificationRepository,

        // Util
        SecurityUtil,
        EmailSender,
    ],
    exports: [UserService, UserRepository],
})
export default class UserModule {}
