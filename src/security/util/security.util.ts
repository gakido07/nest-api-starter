import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

interface PasswordEncoder {
  encode(rawPassword: string): Promise<string>;
  match(rawPassword: string, hash: string): Promise<boolean>;
}

@Injectable()
export default class SecurityUtil {
  passwordEncoder(): PasswordEncoder {
    return {
      encode: async (rawPassword: string): Promise<string> => hash(rawPassword, 12),
      match: async (rawPassword: string, hash: string): Promise<boolean> =>
        compare(rawPassword, hash),
    };
  }

  extractUserIdFromUserRoute(url: string, urlSubRoute: string): string {
    if (!url.includes(urlSubRoute)) {
      throw new HttpException('Invalid argument', HttpStatus.CONFLICT);
    }
    return url.split('/', 3)[2];
  }
}
