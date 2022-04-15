import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';

import Verification, {
    VerificationDocument,
} from './verification';

interface VerificationRepository {
    saveVerificationRecord(
        verification: Verification,
    ): Promise<Verification>;
    findVerificationRecord(info: string): Promise<Verification>;
    deleteVerificationRecordByInfo(info: string): Promise<void>;
    verificationRecordExists(info: string): Promise<boolean>;
}

@Injectable()
export default class VerificationRepositoryImpl
    implements VerificationRepository
{
    constructor(
        @InjectModel(Verification.name)
        private verificationModel: Model<VerificationDocument>,
    ) {}

    async verificationRecordExists(info: string): Promise<boolean> {
        return (await this.verificationModel.exists({ info: info })) ? true : false;
    }

    async saveVerificationRecord(verification: Verification): Promise<Verification> {
        const newVerificationRecord = new this.verificationModel(
            verification
        );
        return await newVerificationRecord.save();
    }

    async findVerificationRecord(info: string): Promise<Verification> {
        return await this.verificationModel.findOne({ info: info });
    }
    async deleteVerificationRecordByInfo(info: string): Promise<void> {
        await this.verificationModel.deleteOne({ info: info });
    }
}
