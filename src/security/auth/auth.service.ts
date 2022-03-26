import { Body, Injectable, Logger } from '@nestjs/common';

import UserService from 'src/user/user.service';
import { LoginRequest, SignUpRequest } from './auth.dto';
import JwtUtil, { Claims } from './jwt/jwt.util';
import AuthDto from './auth.dto';
import User, { UserDocument } from 'src/user/user';
import {
    FailedAuthentication,
    InvalidRefreshToken,
    UserExistsException,
} from 'src/exception/auth.exceptions';
import SecurityUtil from '../security.util';
import { AdminAuthDto } from 'src/admin/admin.dto';
import Admin, { AdminDocument } from 'src/admin/admin';
import AdminService from 'src/admin/admin.service';
import { EmailVerificationRequest, VerifyCodeRequest } from 'src/user/emailVerification/email.verification.dto';
import EmailVerification from 'src/user/emailVerification/email.verification';
import EmailverificationService from 'src/user/emailVerification/email.verification.service';
import { UserDto } from 'src/user/user.dto';

interface AuthService {
    authenticateUser(loginRequest: LoginRequest): Promise<AuthDto>;
    refreshToken(
        refreshToken: string,
        userId: string,
    ): Promise<{ accessToken: string }>;
    authenticateAdmin(loginRequest: LoginRequest): Promise<AdminAuthDto>;
}

@Injectable()
export default class AuthServiceImpl implements AuthService {
    private readonly logger = new Logger(AuthServiceImpl.name);

    constructor(
        private userService: UserService,
        private adminService: AdminService,
        private emailVerificationService: EmailverificationService,
        private jwtUtil: JwtUtil,
        private securityUtil: SecurityUtil,
    ) {}

    async authenticateAdmin(loginRequest: LoginRequest): Promise<AdminAuthDto> {
        const { email, password } = loginRequest;

        const admin: AdminDocument = await this.adminService.findAdminByEmail(
            email,
        );

        if (!this.securityUtil.passwordEncoder().match(password, admin.password)) {
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

        const user = await this.userService.findUserByEmail(loginRequest.email);
        this.jwtUtil.generateJwt<UserDocument>(user);

        if (!this.securityUtil.passwordEncoder().match(password, user.password)) {
            this.logger.log(
                `Failed authentication attempt for user with email ${email}`,
            );
            throw new FailedAuthentication('Invalid username or passsword');
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
        const user = await this.userService.findUserById(userId);
        const claims = this.jwtUtil.verifyJwt(refreshToken);

        if(claims.jti !== user.refreshTokenId) {
            throw new InvalidRefreshToken("Invalid refresh token");
        }

        return {
            accessToken: this.jwtUtil.generateJwt(user),
        };
    }


    async signUpUser(signUpRequest: SignUpRequest): Promise<UserDto> {
        return await this.userService.signUpUser(signUpRequest);
    }

    async verifyCode(email: string, code: number): Promise<EmailVerification> {
        return await this.emailVerificationService.verifyCode(email, code);
    }

    async sendEmailVerificationMail(
        email: string
    ): Promise<string> {
        return await this.emailVerificationService.sendVerificationEmail(email, 'USER');
    }
}
