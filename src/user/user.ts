import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  autoCreate: true,
})
export default class User {
  @Prop({
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ required: true, type: Boolean })
  accountLocked: boolean;

  @Prop({ type: String })
  refreshTokenId: string;

  constructor(firstName: string, lastName: string, email: string, password: string) {
    this.firstName = firstName;
    this.lastName = lastName;
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
