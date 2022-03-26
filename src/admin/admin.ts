import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { SignUpAdminRequest } from './admin.dto';

export type AdminDocument = Admin & Document;

@Schema()
export default class Admin {
    @Prop({ type: String, required: true })
    firstName: string;

    @Prop({ type: String, required: true })
    lastName: string;

    @Prop({
        type: String,
        required: true,
        unique: true,
    })
    email: string;

    @Prop({
        type: String,
        required: true,
        uppercase: true,
        enum: {
            values: ['ADMIN', 'SUPER_ADMIN'],
            message: 'Invalid Admin Role',
        },
    })
    role: string;

    @Prop({
        type: String,
        required: true,
        unique: true,
        maxlength: 11,
        minlength: 11,
    })
    phoneNumber: string;

    @Prop({ type: String, required: true })
    password: string;

    @Prop({
        type: Boolean,
        required: true,
    })
    accountLocked: boolean;

    constructor(request: SignUpAdminRequest) {
        this.email = request.email;
        this.firstName = request.firstName;
        this.lastName = request.lastName;
        this.role = 'ADMIN';
        this.password = request.password;
        this.phoneNumber = request.phoneNumber;
    }

    getRole(): string {
        return this.role;
    }
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

// Bind getters to document or you'll get errors while calling them after fetching from db

AdminSchema.methods.getRole = function (): string {
    return this.role;
};
