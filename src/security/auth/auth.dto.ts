import { IsEmail, IsJWT, IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";

export default class AuthDto {
    id: string;
    email: string;
    accessToken: string;
    refreshToken: string;

    constructor(
        id: string,
        email: string,
        accessToken: string,
        refreshToken: string,
    ) {
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
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class RefreshTokenRequest {
    @IsMongoId()
    @IsNotEmpty()
    userId: string;

    @IsJWT()
    @IsNotEmpty()
    refreshToken: string;
}

export class SignUpRequest {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
