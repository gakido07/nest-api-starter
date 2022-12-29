import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import User, { UserDocument } from './user';

@Injectable()
export default class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findUserByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email: email });
  }

  async findUserById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  async saveUser(user: User): Promise<UserDocument> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async deleteUserByEmail(email: string): Promise<void> {
    const newUser = await this.findUserByEmail(email);
    await newUser.delete();
  }

  async userEmailExists(email: string): Promise<boolean> {
    return (await this.findUserByEmail(email)) ? true : false;
  }
}
