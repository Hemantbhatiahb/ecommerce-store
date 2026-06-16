import { Injectable } from '@nestjs/common';
import { Coupon } from '../../shared/interfaces/coupon.interface';
import { DiscountsRepository } from './discounts.repository';

@Injectable()
export class DiscountsService {
  constructor(private readonly discountsRepository: DiscountsRepository) {}

  getUserCoupons(userId: string): Promise<Coupon[]> {
    return this.discountsRepository.findValidCoupons(userId);
  }

  
}
