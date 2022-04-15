import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { generateVerificationcode } from './verification.util';

export type VerificationDocument = Verification & Document;

@Schema({
    timestamps: true,
})
export default class Verification {
    @Prop({ required: true, type: String, unique: true })
    info: string;

    @Prop({ 
        required: true,
        type: String,
        enum: {
            values: ['EMAIL', 'NUMBER'],
            message: "Invalid verification type"
        }
    })
    type: string;

    @Prop({ required: true, type: Number })
    verificationCode: number;

    @Prop({ required: true, type: Boolean })
    verified: boolean;

    constructor(info: string, type: string) {
        this.info = info;
        this.type = type;
        this.verificationCode = generateVerificationcode();
        this.verified = false;
    }
}

export const VerificationSchema =
    SchemaFactory.createForClass(Verification);
