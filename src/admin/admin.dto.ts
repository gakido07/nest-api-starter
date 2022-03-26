import {
    IsEmail,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { AdminDocument } from './admin';

export class AdminAuthDto {
    id: string;
    @IsEmail()
    email: string;
    accessToken: string;
}

export class AdminDto {
    @IsMongoId()
    @IsNotEmpty()
    id: string;
    @IsEmail()
    @IsNotEmpty()
    email: string;

    constructor(admin: AdminDocument) {
        this.id = admin.id;
        this.email = admin.email;
    }
}

export class SignUpAdminRequest {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @MaxLength(11)
    @MinLength(11)
    @IsString()
    @IsOptional()
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
