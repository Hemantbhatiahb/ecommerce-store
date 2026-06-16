import { Injectable } from '@nestjs/common';
import { Cart } from '../../shared/interfaces/cart.interface';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartsRepository {
  async upsertCartItem(_payload: AddToCartDto): Promise<Cart> {
    throw new Error('Not implemented');
  }

  async findByUserId(_userId: string): Promise<Cart | null> {
    throw new Error('Not implemented');
  }
}
