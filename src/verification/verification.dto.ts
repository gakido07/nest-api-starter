import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class EmailVerificationRequest {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'email of user to be verified',
    type: String,
    required: true,
  })
  email: string;
}

export class VerifyCodeRequest {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'email of user to be verified',
    type: String,
    required: true,
  })
  email: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1000)
  @Max(9999)
  @ApiProperty({
    description: 'code sent to email',
    type: Number,
    required: true,
    title: 'Code',
  })
  code: number;
}
