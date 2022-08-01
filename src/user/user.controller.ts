import { Controller, Param, Get, UseGuards, NotFoundException, Headers } from '@nestjs/common';

import UserService from './user.service';
import UserRouteGuard from 'src/security/auth/guards/user.route.guard';
import { UserDto } from './user.dto';
import { extractTokenFromAuthHeader } from 'src/common/util';
import JwtUtil from 'src/security/util/jwt.util';
import { ApiOkResponse, ApiResponse, getSchemaPath } from '@nestjs/swagger';

@Controller('/users/')
@UseGuards(UserRouteGuard)
export default class UserController {
  constructor(private userService: UserService, private jwtUtil: JwtUtil) {}

  @Get('/')
  async getUserById(
    @Headers('Authorization') authHeader: string
  ): Promise<UserDto> {
    const token = extractTokenFromAuthHeader(authHeader);
    const id  = this.jwtUtil.extractClaimFromToken(token, 'sub');
    return new UserDto(
      await this.userService.findUserById({
        id: id,
        exception: new NotFoundException('User not found'),
      })
    );
  }
}
