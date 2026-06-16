import { BadRequestException, Injectable } from "@nestjs/common";
import { GenerateDiscountDto } from "./dto/generate-discount.dto";
import { AdminRepository } from "./admin.repository";
import { AdminStats } from "./interfaces/admin-stats.interface";
import { Coupon } from "src/shared/interfaces/coupon.interface";
import { USER_ROLES } from "src/shared/constants/roles.constants";
import { store } from "src/shared/store/data.store";

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async generateDiscount(
    adminId: string,
    payload: GenerateDiscountDto,
  ): Promise<Coupon> {
    const user = await this.adminRepository.findById(adminId);
    await this.adminRepository.findById(payload.userId);

    if (user && user.role !== USER_ROLES.ADMIN) {
      throw new BadRequestException("Only admins can generate coupons");
    }

    const coupon: Coupon = {
      code: `SAVE${payload.percentage}`,
      userId: payload.userId,
      isUsed: false,
      percentage: payload.percentage,
    };

    store.coupons.push(coupon);

    return coupon;
  }

  async getStats(adminId: string): Promise<AdminStats> {
    const user = await this.adminRepository.findById(adminId);

    if (user && user.role !== USER_ROLES.ADMIN) {
      throw new BadRequestException("Only admins can view stats");
    }
    const revenue = store.orders.reduce((acc, order) => acc + order.total, 0);

    const itemsPurchased = store.orders.reduce(
      (sum, order) =>
        sum + order.items.reduce((acc, item) => acc + item.quantity, 0),
      0,
    );

    const totalDiscountsGiven = store.orders.reduce((acc, order) => {
      const discountAmount = order.subtotal - order.total;

      return acc + discountAmount;
    }, 0);

    return {
      itemsPurchased,
      revenue,
      discountCodesGenerated: store.coupons.length,
      totalDiscountsGiven,
    };
  }
}
