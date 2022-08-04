import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsJWT, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export default class AuthDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  constructor(id: string, email: string, accessToken: string, refreshToken: string) {
    this.id = id;
    this.email = email;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

export class LoginRequest {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'email of user',
    type: String,
    required: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'password of user',
    type: String,
    required: true,
  })
  password: string;
}

export class RefreshTokenRequest {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'id of user',
    type: String,
    required: true,
  })
  userId: string;

  @IsJWT()
  @IsNotEmpty()
  @ApiProperty({
    description: 'refresh token for user',
    type: String,
    required: true,
  })
  refreshToken: string;
}

export class SignUpRequest {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'email of user to be registered',
    type: String,
    required: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'first name of user to be verified',
    type: String,
    required: true,
  })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'last name of user to be verified',
    type: String,
    required: true,
  })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'raw password of user to be verified',
    type: String,
    required: true,
  })
  password: string;
}
