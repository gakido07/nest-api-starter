import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import UserController from './user.controller';
import UserRepository from './user.repository';
import User, { UserSchema } from './user';
import UserService from './user.service';
import EmailSender from 'src/config/email/email.sender';
import SecurityUtil from 'src/security/util/security.util';
import VerificationModule from 'src/verification/verification.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    VerificationModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, SecurityUtil, EmailSender],
  exports: [UserService],
})
export default class UserModule {}
