import { Body, Controller, Get, Post } from '@nestjs/common';
import { GenerateDiscountDto } from './dto/generate-discount.dto';
import { AdminService } from './admin.service';
import { AdminStats } from './interfaces/admin-stats.interface';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('discounts/generate')
  generateDiscount(@Body() payload: GenerateDiscountDto): Promise<void> {
    return this.adminService.generateDiscount(payload);
  }

  @Get('stats')
  getStats(): Promise<AdminStats> {
    return this.adminService.getStats();
  }
}
