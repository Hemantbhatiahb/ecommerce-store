import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { CartsService } from './carts.service';
import { CartsRepository } from './carts.repository';
import { AdminRepository } from '../admin/admin.repository';

import { AddToCartDto } from './dto/add-to-cart.dto';

describe('CartsService', () => {
  let service: CartsService;

  const cartsRepository = {
    upsertCartItem: jest.fn(),
    findByUserId: jest.fn(),
  };

  const adminRepository = {
    findById: jest.fn(),
  };

  const userId = 'u-1001';

  const addToCartDto: AddToCartDto = {
    userId,
    items: [
      {
        productId: 'p-2001',
        quantity: 2,
      },
    ],
  };

  const mockCart = {
    userId,
    items: [
      {
        productId: 'p-2001',
        quantity: 2,
      },
    ],
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    adminRepository.findById.mockResolvedValue({
      id: userId,
    });

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          CartsService,
          {
            provide: CartsRepository,
            useValue: cartsRepository,
          },
          {
            provide: AdminRepository,
            useValue: adminRepository,
          },
        ],
      }).compile();

    service = module.get<CartsService>(CartsService);
  });

  describe('addToCart', () => {
    it('should add item to cart successfully', async () => {
      cartsRepository.upsertCartItem.mockResolvedValue(
        mockCart,
      );

      const result = await service.addToCart(
        addToCartDto,
      );

      expect(result).toEqual(mockCart);

      expect(
        adminRepository.findById,
      ).toHaveBeenCalledWith(userId);

      expect(
        cartsRepository.upsertCartItem,
      ).toHaveBeenCalledWith(
        userId,
        addToCartDto.items,
      );
    });

    it('should throw when user does not exist', async () => {
      adminRepository.findById.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(
        service.addToCart(addToCartDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should call repository once', async () => {
      cartsRepository.upsertCartItem.mockResolvedValue(
        mockCart,
      );

      await service.addToCart(addToCartDto);

      expect(
        cartsRepository.upsertCartItem,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserCart', () => {
    it('should return user cart', async () => {
      cartsRepository.findByUserId.mockResolvedValue(
        mockCart,
      );

      const result =
        await service.getUserCart(userId);

      expect(result).toEqual(mockCart);

      expect(
        adminRepository.findById,
      ).toHaveBeenCalledWith(userId);

      expect(
        cartsRepository.findByUserId,
      ).toHaveBeenCalledWith(userId);
    });

    it('should return null when cart does not exist', async () => {
      cartsRepository.findByUserId.mockResolvedValue(
        null,
      );

      const result =
        await service.getUserCart(userId);

      expect(result).toBeNull();
    });

    it('should throw when user does not exist', async () => {
      adminRepository.findById.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(
        service.getUserCart(userId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
