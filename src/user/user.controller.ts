import { Controller, Get, UseGuards, NotFoundException } from '@nestjs/common';

import UserService from './user.service';
import UserRouteGuard from 'src/security/auth/guards/user.route.guard';
import { UserDto } from './user.dto';
import JwtUtil from 'src/security/util/jwt.util';
import { Claims } from 'src/common/decorators';

@Controller('/users/')
@UseGuards(UserRouteGuard)
export default class UserController {
  constructor(private userService: UserService, private jwtUtil: JwtUtil) {}

  @Get('/')
  async getUserById(@Claims('sub') id: string): Promise<UserDto> {
    return new UserDto(
      await this.userService.findUserById({
        id,
        exception: new NotFoundException('User not found'),
      })
    );
  }
}
