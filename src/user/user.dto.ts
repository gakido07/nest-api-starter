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
    id: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    constructor(user: UserDocument) {
        this.id = user.id;
        this.email = user.email;
    }
}

export class ChangePasswordRequest {
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @IsString()
    @IsNotEmpty()
    newPassword: string;
}
