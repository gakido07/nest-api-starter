import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { Request } from 'express';

import UserServiceImpl from "src/user/user.service";
import RouteGuard from "./interface/route.guard";
import { EmailVerificationRequest } from "src/user/verification/verification.dto";
import { UserExistsException } from "src/exception/auth.exceptions";

@Injectable()
export default class VerificationGuard implements CanActivate {

    constructor(private userService: UserServiceImpl) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.getArgByIndex(0);

        const verificationPayload: EmailVerificationRequest = request.body;

        const { email } = verificationPayload;

        const type: string = 'EMAIL';

        console.log(type);

        switch (type) {
            case 'EMAIL': {
                return new Promise<boolean>((resolve, reject) => {
                    this.userService.userExists(verificationPayload.email).then(result => {
                        if(result) {
                            resolve(false);
                        }
                        else {
                            resolve(true);
                        }
                    })
                });
            }
            case 'NUMBER': {

            }

            default:
                return false;
        }   
    }
    
}