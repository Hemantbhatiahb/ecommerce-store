import { Injectable } from '@nestjs/common';
import { Cart } from '../../shared/interfaces/cart.interface';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartsRepository } from './carts.repository';

@Injectable()
export class CartsService {
  constructor(private readonly cartsRepository: CartsRepository) {}

  addToCart(payload: AddToCartDto): Promise<Cart> {
    return this.cartsRepository.upsertCartItem(payload);
  }

  getUserCart(userId: string): Promise<Cart | null> {
    return this.cartsRepository.findByUserId(userId);
  }
}
