import { HttpException, HttpStatus, Logger } from '@nestjs/common';

export class EmailVerificationRecordNotFound extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.FORBIDDEN);
    }
}

export class InvalidVerificationCodeException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.FORBIDDEN);
    }
}

export class UnverifiedEmailException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.FORBIDDEN);
    }
}
