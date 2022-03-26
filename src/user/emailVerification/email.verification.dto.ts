import { IsEmail, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class EmailVerificationRequest {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class VerifyCodeRequest {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1000)
    @Max(9999)
    code: number;
}
