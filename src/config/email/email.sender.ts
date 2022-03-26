import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { emailTemplate } from './email.template';

interface EmailSender {
    sendEmail(
        email: string,
        subject: string,
        message: string,
    ): Promise<SMTPTransport.SentMessageInfo>;
}

@Injectable()
export default class EmailSenderImpl implements EmailSender {
    private readonly logger = new Logger(EmailSenderImpl.name);
    private readonly subject = 'Nest Api Template';

    private createTransport(): nodemailer.Transporter<SMTPTransport.SentMessageInfo> {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.apiEmail,
                pass: process.env.apiEmailPassword,
            },
        });
        return transporter;
    }

    async sendEmail(
        email: string,
        subject: string,
        body: string,
    ): Promise<SMTPTransport.SentMessageInfo> {
        return await this.createTransport().sendMail({
            from: this.subject,
            to: email,
            subject: subject,
            html: emailTemplate(body),
        });
    }
}
