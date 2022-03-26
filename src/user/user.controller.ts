import { Controller, Param, Post, Req, Get, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import UserService from './user.service';
import User, { UserDocument } from './user';
import { UserRouteGuard } from 'src/security/auth/guards/user.route.guard';
import { UserDto } from './user.dto';

@Controller('/users/:id')
@UseGuards(UserRouteGuard)
export default class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/')
    async getUserById(@Param('id') id: string): Promise<UserDto> {
        return new UserDto(await this.userService.findUserById(id));
    }

}
