import { Controller, Get, Param } from '@nestjs/common';
import { Coupon } from '../../shared/interfaces/coupon.interface';
import { DiscountsService } from './discounts.service';

@Controller()
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Get('users/:userId/coupons')
  getUserCoupons(@Param('userId') userId: string): Promise<Coupon[]> {
    return this.discountsService.getUserCoupons(userId);
  }
}
