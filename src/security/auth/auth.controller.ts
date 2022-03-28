import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import AuthDto, { LoginRequest, RefreshTokenRequest, SignUpRequest } from './auth.dto';
import AuthService from './auth.service';
import { Public } from 'src/config/util/decorators';
import { EmailVerificationRequest, VerifyCodeRequest } from 'src/user/emailVerification/email.verification.dto';
import EmailVerification from 'src/user/emailVerification/email.verification';
import { UserDto } from 'src/user/user.dto';
import { EmailVerificationGuard } from './guards/email.verification.guard';
import { AdminAuthDto } from 'src/admin/admin.dto';

@Controller('/auth')
@Public()
export default class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    async authenticate(@Req() request: Request): Promise<AuthDto> {
        const loginRequest: LoginRequest = request.body;
        return await this.authService.authenticateUser(loginRequest);
    }

    @Post('/admin/login')
    async authenticateAdmin(@Body() loginRequest: LoginRequest): Promise<AdminAuthDto> {
        return await this.authService.authenticateAdmin(loginRequest);
    }

    @Post('/email-verification/')
    @UseGuards(EmailVerificationGuard)
    async sendVerificationMail(@Body() emailVerificationRequest: EmailVerificationRequest): Promise<string> {
        const { email } = emailVerificationRequest;
        return await this.authService.sendEmailVerificationMail(email);
    }

    @Post('/email-verification/verify-code')
    async verifyCode(@Body() request: VerifyCodeRequest): Promise<EmailVerification> {
        const { email, code } = request;
        return await this.authService.verifyCode(email, code);
    }

    @Post('/sign-up')
    async signUp(@Body() request: SignUpRequest): Promise<UserDto> {
        return await this.authService.signUpUser(request);
    }

    @Post('/refresh-token')
    async refreshToken(@Body() request: RefreshTokenRequest): Promise<{accessToken: string}> {
        const { userId, refreshToken } = request;
        return await this.authService.refreshToken(refreshToken, userId);
    }
}
