import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Coupon } from "../../shared/interfaces/coupon.interface";
import { store } from "../../shared/store/data.store";

@Injectable()
export class DiscountsRepository {
  async findByCode(code: string): Promise<Coupon | null> {
    return store.coupons.find((coupon) => coupon.code === code) ?? null;
  }

  async findValidCoupons(userId: string): Promise<Coupon[]> {
    return store.coupons.filter((coupon) => coupon.userId === userId && !coupon.isUsed);
  }

  async save(coupon: Coupon): Promise<Coupon> {
    store.coupons.push(coupon);
    return coupon;
  }

  async markAsUsed(code: string): Promise<Coupon> {
    const coupon = store.coupons.find((entry) => entry.code === code);

    if (!coupon) {
      throw new NotFoundException(`Coupon not found: ${code}`);
    }

    if (coupon.isUsed) {
      throw new BadRequestException(`Coupon already used: ${code}`);
    }

    coupon.isUsed = true;

    return coupon;
  }

  async findValidCoupon(code: string, userId: string): Promise<Coupon> {
    const coupon = await this.findByCode(code);

    if (!coupon) {
      throw new NotFoundException("Coupon not found");
    }

    if (coupon.userId !== userId) {
      throw new BadRequestException("Coupon does not belong to user");
    }

    if (coupon.isUsed) {
      throw new BadRequestException("Coupon already used");
    }

    return coupon;
  }
}
