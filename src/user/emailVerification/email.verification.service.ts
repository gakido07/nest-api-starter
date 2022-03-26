import { Injectable, Logger } from '@nestjs/common';

import EmailSender from '../../config/email/email.sender';
import { FailedEmailException } from '../../exception/email.sender.exceptions';
import {
    EmailVerificationRecordNotFound,
    InvalidVerificationCodeException,
} from '../../exception/email.verification.exceptions';
import EmailVerification from './email.verification';
import EmailVerificationRepository from './email.verification.repository';
import {
    adminEmailVerificationTemplate,
    emailVerificationTemplate,
    generateVerificationcode,
} from './email.verification.util';

interface EmailVerificationService {
    sendVerificationEmail(email: string, role: string): Promise<string>;
    loadVerificationRecord(email: string): Promise<EmailVerification>;
    verificationRecordExists(email: string): Promise<boolean>;
    verifyCode(
        email: string,
        verificationCode: number,
    ): Promise<EmailVerification>;
    deleteVerificationRecord(email: string): Promise<void>;
}

@Injectable()
export default class EmailverificationServiceImpl
    implements EmailVerificationService
{
    private logger = new Logger(EmailverificationServiceImpl.name);

    constructor(
        private emailVerificationRepository: EmailVerificationRepository,
        private emailSender: EmailSender,
    ) {}

    async deleteVerificationRecord(email: string): Promise<void> {
        await this.emailVerificationRepository.deleteVerificationRecordByEmail(
            email,
        );
    }

    async verificationRecordExists(email: string): Promise<boolean> {
        return await this.emailVerificationRepository.verificationRecordExists(
            email,
        );
    }

    async verifyCode(
        email: string,
        verificationCode: number,
    ): Promise<EmailVerification> {
        const verificationRecord: EmailVerification =
            await this.loadVerificationRecord(email);
        if (!(verificationRecord.verificationCode === verificationCode)) {
            throw new InvalidVerificationCodeException(
                `Invalid verification code for user: ${verificationRecord.email}`,
            );
        }
        verificationRecord.verified = true;
        return await this.emailVerificationRepository.saveVerificationRecord(
            verificationRecord,
        );
    }

    async loadVerificationRecord(email: string): Promise<EmailVerification> {
        const emailVerification =
            await this.emailVerificationRepository.findVerificationRecordbyEmail(
                email,
            );
        if (!emailVerification?.email) {
            throw new EmailVerificationRecordNotFound(
                'Email verification record not found',
            );
        }
        return emailVerification;
    }

    async sendVerificationEmail(email: string, role: string): Promise<string> {
        let emailVerification: EmailVerification = new EmailVerification(
            email,
            role,
        );
        let regeneration = false;
        if (await this.verificationRecordExists(email)) {
            regeneration = true;
            this.logger.log(
                `email verification code regeneration request for email: ${email}`,
            );
            emailVerification = await this.loadVerificationRecord(email);
            emailVerification.verificationCode = generateVerificationcode();
        }
        try {
            if (!regeneration) {
                this.logger.log(
                    `email verification code generation request for email: ${email}`,
                );
            }
            if (role === 'USER') {
                await this.emailSender.sendEmail(
                    email,
                    'Nest Api Template Email Verification',
                    emailVerificationTemplate(
                        emailVerification.verificationCode,
                    ),
                );
            }
            if (role === 'ADMIN') {
                await this.emailSender.sendEmail(
                    email,
                    'Nest Api Template Email Verification',
                    adminEmailVerificationTemplate(
                        emailVerification.verificationCode,
                    ),
                );
            }
            this.emailVerificationRepository.saveVerificationRecord(
                emailVerification,
            );
        } catch (error) {
            this.logger.error(
                `Email verification mail failed for email: ${email}`,
            );
            this.logger.error(`${error.message}`);
            await this.emailVerificationRepository
                .deleteVerificationRecordByEmail(email)
                .catch((error) =>
                    this.logger.error(
                        'Email verification clean up failed for email',
                        email,
                    ),
                );
            throw new FailedEmailException('Email sending failed');
        }
        return emailVerification.email;
    }
}
