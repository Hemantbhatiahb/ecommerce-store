import { Injectable } from '@nestjs/common';
import { Coupon } from '../../shared/interfaces/coupon.interface';

@Injectable()
export class DiscountsRepository {
  async findCouponsByUserId(_userId: string): Promise<Coupon[]> {
    throw new Error('Not implemented');
  }
}
