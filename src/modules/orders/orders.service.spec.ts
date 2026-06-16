import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { CartsRepository } from '../carts/carts.repository';
import { DiscountsRepository } from '../discounts/discounts.repository';
import { AdminRepository } from '../admin/admin.repository';

import { CheckoutDto } from './dto/checkout.dto';
import { Coupon } from '../../shared/interfaces/coupon.interface';
import { CartItem } from '../../shared/interfaces/cart-item.interface';
import { DISCOUNT_CONFIG } from '../../shared/constants/app.constants';

describe('OrdersService', () => {
  let service: OrdersService;

  const ordersRepository = {
    save: jest.fn(),
    count: jest.fn(),
  };

  const cartsRepository = {
    findByUserId: jest.fn(),
    clearCart: jest.fn(),
  };

  const discountsRepository = {
    findValidCoupon: jest.fn(),
    markAsUsed: jest.fn(),
    save: jest.fn(),
  };

  const adminRepository = {
    findById: jest.fn(),
  };

  const userId = 'u-1001';

  const cartItems: CartItem[] = [
    {
      productId: 'p-2001',
      quantity: 2,
    },
    {
      productId: 'p-2002',
      quantity: 1,
    },
  ];

  const cart = {
    userId,
    items: cartItems,
  };

  const coupon: Coupon = {
    code: 'SAVE15',
    userId,
    percentage: 15,
    isUsed: false,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    adminRepository.findById.mockResolvedValue({
      id: userId,
    });

    ordersRepository.count.mockResolvedValue(1);

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          OrdersService,
          {
            provide: OrdersRepository,
            useValue: ordersRepository,
          },
          {
            provide: CartsRepository,
            useValue: cartsRepository,
          },
          {
            provide: DiscountsRepository,
            useValue: discountsRepository,
          },
          {
            provide: AdminRepository,
            useValue: adminRepository,
          },
        ],
      }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  describe('checkout', () => {
    it('should checkout successfully without coupon', async () => {
      cartsRepository.findByUserId.mockResolvedValue(cart);

      const dto: CheckoutDto = {
        userId,
      };

      const result = await service.checkout(dto);

      expect(result.order).toBeDefined();
      expect(result.order.userId).toBe(userId);
      expect(result.order.discount).toBe(0);

      expect(ordersRepository.save).toHaveBeenCalled();
      expect(cartsRepository.clearCart).toHaveBeenCalledWith(
        userId,
      );
    });

    it('should checkout successfully with coupon', async () => {
      cartsRepository.findByUserId.mockResolvedValue(cart);

      discountsRepository.findValidCoupon.mockResolvedValue(
        coupon,
      );

      const dto: CheckoutDto = {
        userId,
        couponCode: coupon.code,
      };

      const result = await service.checkout(dto);

      expect(
        discountsRepository.findValidCoupon,
      ).toHaveBeenCalledWith(coupon.code, userId);

      expect(
        discountsRepository.markAsUsed,
      ).toHaveBeenCalledWith(coupon.code);

      expect(result.order.discount).toBe(15);
    });

    it('should throw when user does not exist', async () => {
      adminRepository.findById.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(
        service.checkout({ userId }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw when cart is empty', async () => {
      cartsRepository.findByUserId.mockResolvedValue(null);

      await expect(
        service.checkout({ userId }),
      ).rejects.toThrow('Cart is empty');
    });

    it('should throw when cart contains no items', async () => {
      cartsRepository.findByUserId.mockResolvedValue({
        userId,
        items: [],
      });

      await expect(
        service.checkout({ userId }),
      ).rejects.toThrow('Cart is empty');
    });

    it('should throw when coupon is invalid', async () => {
      cartsRepository.findByUserId.mockResolvedValue(cart);

      discountsRepository.findValidCoupon.mockRejectedValue(
        new NotFoundException('Coupon not found'),
      );

      await expect(
        service.checkout({
          userId,
          couponCode: 'INVALID',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should mark coupon as used', async () => {
      cartsRepository.findByUserId.mockResolvedValue(cart);

      discountsRepository.findValidCoupon.mockResolvedValue(
        coupon,
      );

      await service.checkout({
        userId,
        couponCode: coupon.code,
      });

      expect(
        discountsRepository.markAsUsed,
      ).toHaveBeenCalledTimes(1);
    });

    it('should clear cart after successful checkout', async () => {
      cartsRepository.findByUserId.mockResolvedValue(cart);

      await service.checkout({ userId });

      expect(
        cartsRepository.clearCart,
      ).toHaveBeenCalledWith(userId);
    });

    it('should save order after successful checkout', async () => {
      cartsRepository.findByUserId.mockResolvedValue(cart);

      await service.checkout({ userId });

      expect(
        ordersRepository.save,
      ).toHaveBeenCalledTimes(1);
    });

    it('should generate reward coupon on nth order', async () => {
      cartsRepository.findByUserId.mockResolvedValue(cart);

      ordersRepository.count.mockResolvedValue(
        DISCOUNT_CONFIG.EVERY_NTH_ORDER,
      );

      const result = await service.checkout({
        userId,
      });

      expect(result.earnedCoupon).not.toBeNull();

      expect(
        discountsRepository.save,
      ).toHaveBeenCalledTimes(1);
    });

    it('should not generate reward coupon when threshold is not reached', async () => {
      cartsRepository.findByUserId.mockResolvedValue(cart);

      ordersRepository.count.mockResolvedValue(1);

      const result = await service.checkout({
        userId,
      });

      expect(result.earnedCoupon).toBeNull();

      expect(
        discountsRepository.save,
      ).not.toHaveBeenCalled();
    });

    it('should not mark coupon as used when checkout fails', async () => {
      cartsRepository.findByUserId.mockResolvedValue(null);

      await expect(
        service.checkout({
          userId,
          couponCode: coupon.code,
        }),
      ).rejects.toThrow();

      expect(
        discountsRepository.markAsUsed,
      ).not.toHaveBeenCalled();
    });
  });
});
