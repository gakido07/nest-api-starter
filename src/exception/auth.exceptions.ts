import { HttpException, HttpStatus } from '@nestjs/common';

export class UserExistsException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.FORBIDDEN);
    }
}

export class UserNotFoundException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.NOT_FOUND);
    }
}

export class FailedAuthentication extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.UNAUTHORIZED);
    }
}

export class InvalidGuardForRouteException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export class InvalidRefreshToken extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
