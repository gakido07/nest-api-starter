import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AdminRouteGuard } from 'src/security/auth/guards/admin.route.guard';
import { AdminDto } from './admin.dto';
import AdminService from './admin.service';

@Controller('/admin/:id')
@UseGuards(AdminRouteGuard)
export default class AdminController {
    
    constructor(private readonly adminService: AdminService) {}

    @Get('/')
    async getAdminDto(@Param('id') id: string): Promise<AdminDto> {
        return new AdminDto(await this.adminService.findAdminById(id));
    }
}
