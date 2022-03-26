import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { Request } from 'express';

import UserServiceImpl from "src/user/user.service";
import RouteGuard from "./interface/route.guard";
import { EmailVerificationRequest } from "src/user/emailVerification/email.verification.dto";
import { UserExistsException } from "src/exception/auth.exceptions";

@Injectable()
export class EmailVerificationGuard implements CanActivate {

    constructor(private userService: UserServiceImpl) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.getArgByIndex(0);

        const verificationPayload: EmailVerificationRequest = request.body;

        return new Promise<boolean>((resolve, reject) => {
            this.userService.userExists(verificationPayload.email).then(result => {
                if(result) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            })
        })
    }
    
}