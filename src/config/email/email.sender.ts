import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
@Injectable()
export default class EmailSender {
  private readonly logger = new Logger(EmailSender.name);

  private createTransport(): nodemailer.Transporter<SMTPTransport.SentMessageInfo> {
    const transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      tls: {
        ciphers: 'SSLv3',
      },
      auth: {
        user: process.env.apiEmailAddress,
        pass: process.env.apiEmailPassword,
      },
    });
    return transporter;
  }

  async sendEmail(
    email: string,
    subject: string,
    html: string
  ): Promise<SMTPTransport.SentMessageInfo> {
    return await this.createTransport().sendMail({
      from: process.env.apiEmailAddress,
      to: email,
      subject: subject,
      html: html,
    });
  }
}
