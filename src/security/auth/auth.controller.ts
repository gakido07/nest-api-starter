import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import AuthDto, { LoginRequest, RefreshTokenRequest, SignUpRequest } from './auth.dto';
import AuthService from './auth.service';
import { Public } from 'src/common/decorators';
import { UserDto } from 'src/user/user.dto';
import VerificationGuard from './guards/verification.guard';
import { EmailVerificationRequest, VerifyCodeRequest } from 'src/verification/verification.dto';
import { AdminAuthDto } from 'src/admin/admin.dto';
import Verification from 'src/verification/verification';

@Controller('/auth')
@Public()
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async authenticate(@Body() loginRequest: LoginRequest): Promise<AuthDto> {
    return await this.authService.authenticateUser(loginRequest);
  }

  @Post('/admin/login')
  async authenticateAdmin(@Body() loginRequest: LoginRequest): Promise<AdminAuthDto> {
    return await this.authService.authenticateAdmin(loginRequest);
  }

  @Post('/verification/email')
  @UseGuards(VerificationGuard)
  async sendVerificationMail(
    @Body() emailVerificationRequest: EmailVerificationRequest
  ): Promise<string> {
    const { email } = emailVerificationRequest;
    return await this.authService.sendEmailVerificationMail(email);
  }

  @Post('/verification/email/verify-code')
  async verifyCode(@Body() request: VerifyCodeRequest): Promise<Verification> {
    const { email, code } = request;
    return await this.authService.verifyCode(email, code);
  }

  @Post('/sign-up')
  async signUp(@Body() request: SignUpRequest): Promise<UserDto> {
    return await this.authService.signUpUser(request);
  }

  @Post('/refresh-token')
  async refreshToken(@Body() request: RefreshTokenRequest): Promise<{ accessToken: string }> {
    const { userId, refreshToken } = request;
    return await this.authService.refreshToken(refreshToken, userId);
  }
}
