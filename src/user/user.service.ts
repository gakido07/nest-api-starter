import { HttpException, Injectable, Logger } from '@nestjs/common';
import User, { UserDocument } from './user';
import { UserExistsException, UserNotFoundException } from '../exception/auth.exceptions';
import { SignUpRequest } from 'src/security/auth/auth.dto';
import UserRepository from './user.repository';
import VerificationService from '../verification/verification.service';
import SecurityUtil from 'src/security/util/security.util';
import { UnverifiedEmailException } from 'src/exception/email.verification.exceptions';
import { UserDto } from './user.dto';

@Injectable()
export default class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private verificationService: VerificationService,
    private securityUtil: SecurityUtil,
    private userRepository: UserRepository
  ) {}

  async findUserByEmail({
    email,
    exception,
  }: {
    email: string;
    exception?: HttpException;
  }): Promise<UserDocument> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user && exception) {
      throw new UserNotFoundException('Invalid username or password');
    }
    return user;
  }

  async findUserById({
    id,
    exception,
  }: {
    id: string;
    exception?: HttpException;
  }): Promise<UserDocument> {
    const user = await this.userRepository.findUserById(id);
    if (!user && exception) throw new UserNotFoundException(`user with id ${id} not found`);
    return user;
  }

  lockUserAccount(email: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async userExists(email: string): Promise<boolean> {
    return await this.userRepository.userEmailExists(email);
  }

  async signUpUser(signUpRequest: SignUpRequest): Promise<UserDto> {
    if (await this.userRepository.userEmailExists(signUpRequest.email))
      throw new UserExistsException('email already registered');

    const emailVerification = await this.verificationService.loadVerificationRecord(
      signUpRequest.email
    );

    if (!emailVerification.verified)
      throw new UnverifiedEmailException(`email ${emailVerification.data} not verified`);

    const { firstName, lastName, password } = signUpRequest;

    signUpRequest.password = await this.securityUtil.passwordEncoder().encode(password);

    const newUser: UserDocument = await this.userRepository.saveUser(
      new User(firstName, lastName, signUpRequest.email, signUpRequest.password)
    );

    await this.verificationService.deleteVerificationRecord(signUpRequest.email);

    this.logger.log(`new user signed up with email: ${signUpRequest.email} `);

    return new UserDto(newUser);
  }
}
