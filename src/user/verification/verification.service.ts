import { Injectable, Logger } from '@nestjs/common';

import EmailSender from '../../config/email/email.sender';
import { FailedEmailException } from '../../exception/email.sender.exceptions';
import {
    EmailVerificationRecordNotFound,
    InvalidVerificationCodeException,
} from '../../exception/email.verification.exceptions';
import Verification from './verification';
import VerificationRepository from './verification.repository';
import {
    adminEmailVerificationTemplate,
    emailVerificationTemplate,
    generateVerificationcode,
} from './verification.util';

interface VerificationService {
    sendVerificationEmail(email: string): Promise<string>;
    loadVerificationRecord(info: string): Promise<Verification>;
    verificationRecordExists(info: string): Promise<boolean>;
    verifyCode(
        info: string,
        verificationCode: number,
    ): Promise<Verification>;
    deleteVerificationRecord(info: string): Promise<void>;
}

@Injectable()
export default class VerificationServiceImpl
    implements VerificationService
{
    private logger = new Logger(VerificationServiceImpl.name);

    constructor(
        private verificationRepository: VerificationRepository,
        private emailSender: EmailSender,
    ) {}

    async deleteVerificationRecord(info: string): Promise<void> {
        await this.verificationRepository.deleteVerificationRecordByInfo(
            info,
        );
    }

    async verificationRecordExists(info: string): Promise<boolean> {
        return await this.verificationRepository.verificationRecordExists(
            info
        );
    }

    async verifyCode(info: string, verificationCode: number): Promise<Verification> {
        const verificationRecord: Verification = await this.loadVerificationRecord(info);
        if (verificationRecord.verificationCode !== verificationCode) {
            throw new InvalidVerificationCodeException(`Invalid verification code for user: ${verificationRecord.info}`);
        }

        verificationRecord.verified = true;
        return await this.verificationRepository.saveVerificationRecord(
            verificationRecord,
        );
    }

    async loadVerificationRecord(info: string): Promise<Verification> {
        const emailVerification =
            await this.verificationRepository.findVerificationRecord(
                info
            );
        if (!emailVerification) {
            throw new EmailVerificationRecordNotFound(
                'Email verification record not found',
            );
        }
        return emailVerification;
    }

    async sendVerificationEmail(info: string): Promise<string> {
        let emailVerification: Verification = new Verification(info, 'EMAIL');

        let regeneration = false;
        if (await this.verificationRecordExists(info)) {
            regeneration = true;
            this.logger.log(`info verification code regeneration request for info: ${info}`);
            emailVerification = await this.loadVerificationRecord(info);
            emailVerification.verificationCode = generateVerificationcode();
        }
        try {
            if (!regeneration) {
                this.logger.log(
                    `info verification code generation request for info: ${info}`,
                );
            }
            await this.emailSender.sendEmail(
                info,
                'Nest Api Template Email Verification',
                emailVerificationTemplate(
                    emailVerification.verificationCode,
                ),
            );

            this.verificationRepository.saveVerificationRecord(emailVerification);

        } catch (error) {
            this.logger.error(`Email verification mail failed for info: ${info}`);
            this.logger.error(`${error.message}`);
            await this.verificationRepository
                .deleteVerificationRecordByInfo(info)
                .catch((error) =>
                    this.logger.error(
                        'Verification clean up failed for info',
                        info,
                    ),
                );
            throw new FailedEmailException('Email sending failed');
        }
        return emailVerification.info;
    }
}
