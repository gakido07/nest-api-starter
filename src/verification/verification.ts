import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { generateVerificationcode } from './verification.util';

export type VerificationDocument = Verification & Document;

@Schema({
  timestamps: true,
})
export default class Verification {
  @Prop({ required: true, type: String, unique: true })
  data: string;

  @Prop({
    required: true,
    type: String,
    enum: {
      values: ['EMAIL', 'PHONE_NUMBER'],
      message: 'Invalid verification type',
    },
  })
  type: 'EMAIL' | 'PHONE_NUMBER';

  @Prop({ required: true, type: Number })
  code: number;

  @Prop({ required: true, type: Boolean })
  verified: boolean;

  constructor(data: string, type: 'EMAIL' | 'PHONE_NUMBER') {
    this.data = data;
    this.type = type;
    this.code = generateVerificationcode();
    this.verified = false;
  }
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);

VerificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });
