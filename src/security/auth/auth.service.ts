import { Body, Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import UserService from 'src/user/user.service';
import { LoginRequest, SignUpRequest } from './auth.dto';
import JwtUtil, { Claims } from '../util/jwt.util';
import AuthDto from './auth.dto';
import User, { UserDocument } from 'src/user/user';
import {
  FailedAuthentication,
  InvalidRefreshToken,
  UserExistsException,
  UserNotFoundException,
} from 'src/exception/auth.exceptions';
import SecurityUtil from '../util/security.util';
import { AdminAuthDto } from 'src/admin/admin.dto';
import Admin, { AdminDocument } from 'src/admin/admin';
import AdminService from 'src/admin/admin.service';
import { VerifyCodeRequest } from 'src/verification/verification.dto';
import Verification from 'src/verification/verification';
import VerificationService from 'src/verification/verification.service';
import { UserDto } from 'src/user/user.dto';

@Injectable()
export default class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private verificationService: VerificationService,
    private jwtUtil: JwtUtil,
    private securityUtil: SecurityUtil
  ) {}

  async authenticateAdmin(loginRequest: LoginRequest): Promise<AdminAuthDto> {
    const { email, password } = loginRequest;

    const admin: AdminDocument = await this.adminService.findAdminByEmail(email);

    if (!(await this.securityUtil.passwordEncoder().match(password, admin.password))) {
      throw new FailedAuthentication('Invalid username or passsword');
    }

    return {
      id: admin.id,
      email: admin.email,
      accessToken: this.jwtUtil.generateJwt(admin),
    };
  }

  async authenticateUser(loginRequest: LoginRequest): Promise<AuthDto> {
    const { email, password } = loginRequest;

    const user = await this.userService.findUserByEmail({
      email: email,
      exception: new UnauthorizedException("Invalid username or password")
    });
    this.jwtUtil.generateJwt<UserDocument>(user);

    if (!(await this.securityUtil.passwordEncoder().match(password, user.password))) {
      this.logger.log(`Failed authentication attempt for user with email ${email}`);
      throw new UnauthorizedException('Invalid username or passsword');
    }

    const { refreshToken, jti } = this.jwtUtil.generateRefreshToken(user);
    user.refreshTokenId = jti;
    user.save();

    return {
      id: user.id,
      email: user.email,
      accessToken: this.jwtUtil.generateJwt(user),
      refreshToken: refreshToken,
    };
  }

  async refreshToken(refreshToken: string, userId: string): Promise<{ accessToken: string }> {
    const user = await this.userService.findUserById({
      id: userId,
      exception: new UnauthorizedException("Invalid username or password") 
    });
    const claims = this.jwtUtil.verifyJwt(refreshToken);
    if (claims.jti !== user.refreshTokenId) {
      throw new InvalidRefreshToken('Invalid refresh token');
    }
    return {
      accessToken: this.jwtUtil.generateJwt(user),
    };
  }

  async signUpUser(signUpRequest: SignUpRequest): Promise<UserDto> {
    return await this.userService.signUpUser(signUpRequest);
  }

  async verifyCode(info: string, code: number): Promise<Verification> {
    return await this.verificationService.verifyCode(info, code);
  }

  async sendEmailVerificationMail(email: string): Promise<string> {
    return await this.verificationService.sendVerificationEmail(email);
  }
}
