import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

import UserService from 'src/user/user.service';

@Injectable()
export default class VerificationGuard implements CanActivate {
  constructor(private userService: UserService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const verificationPayload = request.body;

    const { email } = verificationPayload;

    const type: string = request.url.endsWith('email') ? 'EMAIL' : 'PHONE_NUMBER';

    switch (type) {
      case 'EMAIL': {
        return new Promise<boolean>((resolve, reject) => {
          this.userService.userExists(verificationPayload.email).then(result => {
            if (result) {
              resolve(false);
            } else {
              resolve(true);
            }
          });
        });
      }
      case 'PHONE_NUMBER': {
      }

      default:
        return false;
    }
  }
}
