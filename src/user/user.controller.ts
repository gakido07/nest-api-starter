import { Controller, Get, UseGuards, NotFoundException, Headers } from '@nestjs/common';

import UserService from './user.service';
import UserRouteGuard from 'src/security/auth/guards/user.route.guard';
import { UserDto } from './user.dto';
import JwtUtil, { AppUserDocument, Claims } from 'src/security/util/jwt.util';
import { Claim } from 'src/common/decorators';

@Controller('/users/')
@UseGuards(UserRouteGuard)
export default class UserController {
  constructor(private userService: UserService, private jwtUtil: JwtUtil) {}

  @Get('/')
  async getUserById(
    @Headers('Authorization') authHeader: string,
    @Claim() claims: Claims<AppUserDocument>
  ): Promise<UserDto> {
    return new UserDto(
      await this.userService.findUserById({
        id: claims.sub,
        exception: new NotFoundException('User not found'),
      })
    );
  }
}
