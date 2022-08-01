import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { UserDocument } from './user';

export class UserDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  constructor(user: UserDocument) {
    this.id = user.id;
    this.email = user.email;
  }
}
