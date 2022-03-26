import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';

import Admin, { AdminDocument } from './admin';

interface AdminRepository {
    findAdminByEmail(email: string): Promise<AdminDocument>;
    findAdminById(id: string): Promise<AdminDocument>;
    saveAdmin(admin: Admin): Promise<AdminDocument>;
    lockAdminAccount(email: string): Promise<AdminDocument>;
    adminExists(email: string): Promise<boolean>;
}

@Injectable()
export default class AdminRepositoryImpl implements AdminRepository {
    constructor(
        @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    ) {}

    async findAdminById(id: string): Promise<AdminDocument> {
        return await this.adminModel.findById(id);
    }

    async findAdminByEmail(email: string): Promise<AdminDocument> {
        return await this.adminModel.findOne({ email: email });
    }

    async saveAdmin(admin: Admin): Promise<AdminDocument> {
        const newAdmin = new this.adminModel(admin);
        return await newAdmin.save();
    }

    async lockAdminAccount(email: string): Promise<AdminDocument> {
        const adminDocument: AdminDocument = await this.findAdminByEmail(email);
        adminDocument.accountLocked = true;
        return adminDocument.save();
    }

    async adminExists(email: string): Promise<boolean> {
        return (await this.findAdminByEmail(email)) ? true : false;
    }
}
