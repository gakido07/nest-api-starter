import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import EmailSender from 'src/config/email/email.sender';
import {
    UserExistsException,
    UserNotFoundException,
} from 'src/exception/auth.exceptions';
import { UnverifiedEmailException } from 'src/exception/email.verification.exceptions';
import SecurityUtil from 'src/security/security.util';
import EmailverificationService from 'src/user/emailVerification/email.verification.service';
import Admin, { AdminDocument } from './admin';
import { SignUpAdminRequest } from './admin.dto';
import AdminRepository from './admin.repository';

interface AdminService {
    findAdminByEmail(email: string): Promise<AdminDocument>;
    sendAdminEmailVerification(email: string): Promise<void>;
    signUpAdmin(signUpAdminRequest: SignUpAdminRequest): Promise<Admin>;
    findAdminById(id: string): Promise<AdminDocument>;
}

@Injectable()
export default class AdminServiceImpl implements AdminService {
    constructor(
        private adminRepository: AdminRepository,
        private emailSender: EmailSender,
        private securityUtil: SecurityUtil,
        private emailVerificationService: EmailverificationService,
    ) {}

    async findAdminById(id: string): Promise<AdminDocument> {
        return await this.adminRepository.findAdminById(id);
    }

    async signUpAdmin(signUpAdminRequest: SignUpAdminRequest): Promise<Admin> {
        const { email, password } = signUpAdminRequest;

        const emailVerification =
            await this.emailVerificationService.loadVerificationRecord(email);

        if (!emailVerification.verified)
            throw new UnverifiedEmailException(
                `email ${emailVerification.email} not verified`,
            );

        if (emailVerification.role !== 'ADMIN')
            throw new HttpException('', HttpStatus.CONFLICT);

        if (await this.adminRepository.adminExists(email))
            throw new UserExistsException('server cannot process request');

        signUpAdminRequest.password = await this.securityUtil.passwordEncoder()
            .encode(password);

        const admin: Admin = new Admin(signUpAdminRequest);

        await this.emailVerificationService.deleteVerificationRecord(email);

        return await this.adminRepository.saveAdmin(admin);
    }

    async findAdminByEmail(email: string): Promise<AdminDocument> {
        const admin = await this.adminRepository.findAdminByEmail(email);
        if (!admin) throw new UserNotFoundException(email);
        return admin;
    }

    async sendAdminEmailVerification(email: string): Promise<void> {
        this.emailVerificationService.sendVerificationEmail(email, 'ADMIN');
    }
}
