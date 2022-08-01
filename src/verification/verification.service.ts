import { Injectable, Logger } from '@nestjs/common';
import { renderFile } from 'ejs';

import EmailSender from '../config/email/email.sender';
import { FailedEmailException } from '../exception/email.sender.exceptions';
import {
  EmailVerificationRecordNotFound,
  InvalidVerificationCodeException,
} from '../exception/email.verification.exceptions';
import Verification from './verification';
import VerificationRepository from './verification.repository';
import {
  generateVerificationcode,
} from './verification.util';


@Injectable()
export default class VerificationService {
  private logger = new Logger(VerificationService.name);

  constructor(
    private verificationRepository: VerificationRepository,
    private emailSender: EmailSender
  ) {}

  async deleteVerificationRecord(data: string): Promise<void> {
    await this.verificationRepository.deleteVerificationRecordByData(data);
  }

  async verificationRecordExists(data: string): Promise<boolean> {
    return await this.verificationRepository.verificationRecordExists(data);
  }

  async verifyCode(data: string, verificationCode: number): Promise<Verification> {
    const verificationRecord: Verification = await this.loadVerificationRecord(data);
    if (verificationRecord.code !== verificationCode) {
      throw new InvalidVerificationCodeException(
        `Invalid verification code for user: ${verificationRecord.data}`
      );
    }

    verificationRecord.verified = true;
    return await this.verificationRepository.saveVerificationRecord(verificationRecord);
  }

  async loadVerificationRecord(data: string): Promise<Verification> {
    const emailVerification = await this.verificationRepository.findVerificationRecord(data);
    if (!emailVerification) {
      throw new EmailVerificationRecordNotFound('Email verification record not found');
    }
    return emailVerification;
  }

  async sendVerificationEmail(data: string): Promise<string> {
    let emailVerification: Verification = new Verification(data, 'EMAIL');

    let regeneration = false;
    if (await this.verificationRecordExists(data)) {
      regeneration = true;
      this.logger.log(`data verification code regeneration request for data: ${data}`);
      emailVerification = await this.loadVerificationRecord(data);
      emailVerification.code = generateVerificationcode();
    }
    try {
      if (!regeneration) {
        this.logger.log(`data verification code generation request for data: ${data}`);
      }
      await this.emailSender.sendEmail(
        data,
        'Nest Api Template Email Verification',
        await renderFile('src/config/email/templates/email.verification.html', {
          appName: 'Nest Api Template',
          code: emailVerification.code
        })
      );

      this.verificationRepository.saveVerificationRecord(emailVerification);
    } catch (error) {
      this.logger.error(`Email verification mail failed for data: ${data}`);
      this.logger.error(`${error.message}`);
      await this.verificationRepository
        .deleteVerificationRecordByData(data)
        .catch(error => this.logger.error('Verification clean up failed for data', data));
      throw new FailedEmailException('Email sending failed');
    }
    return emailVerification.data;
  }
}
