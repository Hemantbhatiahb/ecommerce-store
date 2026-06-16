import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { GenerateDiscountDto } from "./dto/generate-discount.dto";
import { AdminService } from "./admin.service";
import { AdminStats } from "./interfaces/admin-stats.interface";
import { Coupon } from "src/shared/interfaces/coupon.interface";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post("/:adminId/generate-discount")
  async generateDiscount(
    @Param("adminId") adminId: string,
    @Body() payload: GenerateDiscountDto,
  ): Promise<{
    message: string;
    data: Coupon;
  }> {
    const coupon = await this.adminService.generateDiscount(adminId, payload);

    return {
      message: "Coupon generated successfully",
      data: coupon,
    };
  }

  @Get("/:adminId/stats")
  async getStats(
    @Param("adminId") adminId: string,
  ): Promise<{ message: string; data: AdminStats }> {
    const stats = await this.adminService.getStats(adminId);
    return {
      message: "Admin stats retrieved successfully",
      data: stats,
    };
  }
}
