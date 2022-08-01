import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';

import Verification, { VerificationDocument } from './verification';

@Injectable()
export default class VerificationRepository {
  constructor(
    @InjectModel(Verification.name)
    private verificationModel: Model<VerificationDocument>
  ) {}

  async verificationRecordExists(data: string): Promise<boolean> {
    return (await this.verificationModel.exists({ data: data })) ? true : false;
  }

  async saveVerificationRecord(verification: Verification): Promise<Verification> {
    const newVerificationRecord = new this.verificationModel(verification);
    return await newVerificationRecord.save();
  }

  async findVerificationRecord(data: string): Promise<Verification> {
    return await this.verificationModel.findOne({ data: data });
  }
  async deleteVerificationRecordByData(data: string): Promise<void> {
    await this.verificationModel.deleteOne({ data: data });
  }
}
