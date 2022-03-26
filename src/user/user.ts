import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
    autoCreate: true,
})
export default class User {
    //TODO write email regex validation

    @Prop({ type: String, lowercase: true, required: true, unique: true })
    email: string;

    @Prop({ type: String, required: true})
    password: string;

    @Prop({ required: true, type: Boolean })
    accountLocked: boolean;

    @Prop({ type: String })
    refreshTokenId: string;

    constructor(
        email: string,
        password: string
    ) {
        this.email = email;
        this.password = password;
        this.accountLocked = false;
        this.refreshTokenId = null;
    }

    getRole(): string {
        return 'USER';
    }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.getRole = (): string => 'USER';
