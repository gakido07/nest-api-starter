import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import User, { UserDocument } from './user';
import {
    UserExistsException,
    UserNotFoundException,
} from '../exception/auth.exceptions';
import { SignUpRequest } from 'src/security/auth/auth.dto';
import UserRepository from './user.repository';
import EmailverificationService from './emailVerification/email.verification.service';
import SecurityUtil from 'src/security/security.util';
import { UnverifiedEmailException } from 'src/exception/email.verification.exceptions';
import { UserDto } from './user.dto';

export interface UserService {
    findUserByEmail(email: string): Promise<UserDocument>;
    findUserById(id: string): Promise<UserDocument>;
    lockUserAccount(email: string): Promise<void>;
    userExists(email: string): Promise<boolean>;
    signUpUser(signUpRequest: SignUpRequest): Promise<UserDto>;
}

@Injectable()
export default class UserServiceImpl implements UserService {
    private readonly logger = new Logger(UserServiceImpl.name);

    constructor(
        private emailVerificationService: EmailverificationService,
        private securityUtil: SecurityUtil,
        private userRepository: UserRepository,
    ) {}


    async findUserByEmail(email: string): Promise<UserDocument> {
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) {
            throw new UserNotFoundException("Invalid username or password");
        }
        return user;
    }


    async findUserById(id: string): Promise<UserDocument> {
        const user = await this.userRepository.findUserById(id);
        if (!user)
            throw new UserNotFoundException(`user with id ${id} not found`);
        return user;
    }

    lockUserAccount(email: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async userExists(email: string): Promise<boolean> {
        return await this.userRepository.userExists(email);
    }

    async signUpUser(signUpRequest: SignUpRequest): Promise<UserDto> {
        

        if (await this.userRepository.userExists(signUpRequest.email))
            throw new UserExistsException('email already registered');

        const emailVerification = await this.emailVerificationService.loadVerificationRecord(signUpRequest.email);

        if (!emailVerification.verified)
            throw new UnverifiedEmailException(`email ${emailVerification.email} not verified`);

        if (emailVerification.role !== 'USER')
            throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);

        const {
            password,
            firstName,
            lastName,
        } = signUpRequest;

        signUpRequest.password = await this.securityUtil
            .passwordEncoder()
            .encode(password);

        const newUser: UserDocument = await this.userRepository.saveUser(new User(
            signUpRequest.email,
            signUpRequest.password,
        ));

        await this.emailVerificationService.deleteVerificationRecord(
            signUpRequest.email,
        );

        this.logger.log(
            `new user signed up with email: ${signUpRequest.email} `,
        );

        return new UserDto(newUser);
    }
}