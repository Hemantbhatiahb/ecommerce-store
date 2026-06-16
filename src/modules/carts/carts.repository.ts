import { Injectable } from '@nestjs/common';
import { CartItem } from '../../shared/interfaces/cart-item.interface';
import { Cart } from '../../shared/interfaces/cart.interface';
import { store } from '../../shared/store/data.store';

@Injectable()
export class CartsRepository {
  async upsertCartItem(
    userId: string,
    items: CartItem[],
  ): Promise<Cart> {
    const existingCart = store.carts.find(
      (entry) => entry.userId === userId,
    );

    const cart: Cart = existingCart ?? {
      userId,
      items: [],
    };

    for (const item of items) {
      const existingItem = cart.items.find(
        (cartItem) => cartItem.productId === item.productId,
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        cart.items.push({
          productId: item.productId,
          quantity: item.quantity,
        });
      }
    }

    if (!existingCart) {
      store.carts.push(cart);
    }

    return cart;
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    return store.carts.find(
      (entry) => entry.userId === userId,
    ) ?? null;
  }

  async clearCart(userId: string): Promise<void> {
    const cart = store.carts.find(
      (entry) => entry.userId === userId,
    );

    if (cart) {
      cart.items = [];
    }
  }
}