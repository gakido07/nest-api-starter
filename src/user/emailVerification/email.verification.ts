import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { generateVerificationcode } from './email.verification.util';

export type EmailverificationDocument = EmailVerification & Document;

@Schema({
    timestamps: true,
})
export default class EmailVerification {
    @Prop({ required: true, type: String, unique: true })
    email: string;

    @Prop({ required: true, type: Number })
    verificationCode: number;

    @Prop({
        required: true,
        type: String,
        uppercase: true,
        enum: {
            values: ['USER', 'ADMIN'],
            message: 'Invalid role',
        },
    })
    role: string;

    @Prop({ required: true, type: Boolean })
    verified: boolean;

    constructor(email: string, role: string) {
        this.email = email;
        this.verificationCode = generateVerificationcode();
        this.verified = false;
        this.role = role;
    }
}

export const EmailverificationSchema =
    SchemaFactory.createForClass(EmailVerification);
