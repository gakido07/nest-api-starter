import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';

import EmailVerification, {
    EmailverificationDocument,
} from './email.verification';

interface EmailVerificationRepository {
    saveVerificationRecord(
        emailVerification: EmailVerification,
    ): Promise<EmailVerification>;
    findVerificationRecordbyEmail(email: string): Promise<EmailVerification>;
    deleteVerificationRecordByEmail(email): Promise<void>;
    verificationRecordExists(email: string): Promise<boolean>;
}

@Injectable()
export default class EmailVerificationRepositoryImpl
    implements EmailVerificationRepository
{
    constructor(
        @InjectModel(EmailVerification.name)
        private emailVerificationModel: Model<EmailverificationDocument>,
    ) {}

    async verificationRecordExists(email: string): Promise<boolean> {
        return (await this.emailVerificationModel.exists({ email: email }))
            ? true
            : false;
    }

    async saveVerificationRecord(
        emailVerification: EmailVerification,
    ): Promise<EmailVerification> {
        const newVerificationRecord = new this.emailVerificationModel(
            emailVerification,
        );
        return await newVerificationRecord.save();
    }

    async findVerificationRecordbyEmail(
        email: string,
    ): Promise<EmailVerification> {
        return await this.emailVerificationModel.findOne({ email: email });
    }
    async deleteVerificationRecordByEmail(email: any): Promise<void> {
        await this.emailVerificationModel.deleteOne({ email: email });
    }
}
