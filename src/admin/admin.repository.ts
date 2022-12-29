import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';

import Admin, { AdminDocument } from './admin';

@Injectable()
export default class AdminRepository {
  constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>) {}

  async findAdminById(id: string): Promise<AdminDocument> {
    return this.adminModel.findById(id);
  }

  async findAdminByEmail(email: string): Promise<AdminDocument> {
    return this.adminModel.findOne({ email: email });
  }

  async saveAdmin(admin: Admin): Promise<AdminDocument> {
    const newAdmin = new this.adminModel(admin);
    return newAdmin.save();
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
