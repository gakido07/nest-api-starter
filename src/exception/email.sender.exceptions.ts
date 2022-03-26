import { HttpException, HttpStatus } from '@nestjs/common';

export class FailedEmailException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.FORBIDDEN);
    }
}
