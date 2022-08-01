import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import EmailSender from "src/config/email/email.sender";
import Verification, { VerificationSchema } from "./verification";
import VerificationRepository from "./verification.repository";
import VerificationService from "./verification.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Verification.name, schema: VerificationSchema },
    ]),
  ],
  providers: [
    VerificationService,
    VerificationRepository,
    EmailSender
  ],
  exports: [VerificationService]
})
export default class VerificationModule {}