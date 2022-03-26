import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Document } from 'mongoose';

import User, { UserDocument } from "./user";

interface UserRepository {
    findUserByEmail(email: string): Promise<UserDocument>;
    findUserById(id: string): Promise<UserDocument>;
    saveUser(user: User): Promise<UserDocument>;
    deleteUserByEmail(email: string): Promise<void>;
    userExists(email: string): Promise<boolean>;
}

@Injectable()
export default class UserRepositoryImpl implements UserRepository {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async findUserByEmail(email: string): Promise<UserDocument> {
        return await this.userModel.findOne({email: email});
    }

    async findUserById(id: string): Promise<UserDocument> {
        return await this.userModel.findById(id);
    }

    async saveUser(user: User): Promise<UserDocument> {
        const newUser = new this.userModel(user);
        return await newUser.save();
    }


    async deleteUserByEmail(email: string): Promise<void> {
        const newUser = await this.findUserByEmail(email);
        await newUser.delete();
    }

    async userExists(email: string): Promise<boolean> {
        return (await this.findUserByEmail(email)) ? true : false;
        
    }
    
}