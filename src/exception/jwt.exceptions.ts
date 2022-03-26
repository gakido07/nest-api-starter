import { HttpException, HttpStatus, Logger } from '@nestjs/common';

export class DecodeJwtError extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
