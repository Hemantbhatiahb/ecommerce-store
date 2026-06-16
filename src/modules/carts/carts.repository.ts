import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Cart } from "../../shared/interfaces/cart.interface";
import { store } from "../../shared/store/data.store";
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { User } from "src/shared/interfaces/user.interface";

@Injectable()
export class CartsRepository {

  async getUser(userId: string): Promise<User | null> {
    const user = store.users.find((entry) => entry.id === userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user
  }

  async upsertCartItem(payload: AddToCartDto): Promise<Cart> {
    // console.log('Before:', store.carts);
    const user = await this.getUser(payload.userId);

    const existingCart = store.carts.find(
      (entry) => entry.userId === payload.userId,
    );

    const cart: Cart = existingCart ?? {
      userId: payload.userId,
      items: [],
    };

    const productIds = payload.items.map((item) => item.productId);

    const products = store.products.filter((product) =>
      productIds.includes(product.id),
    );

    if (products.length !== productIds.length) {
      const foundIds = new Set(products.map((product) => product.id));

      const missingIds = productIds.filter((id) => !foundIds.has(id));

      throw new NotFoundException(
        `Products not found: ${missingIds.join(", ")}`,
      );
    }

    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    for (const item of payload.items) {
      const product = productMap.get(item.productId)!;

      const existingItem = cart.items.find(
        (cartItem) => cartItem.productId === item.productId,
      );

      const nextQuantity = (existingItem?.quantity ?? 0) + item.quantity;

      if (nextQuantity > product.stock) {
        throw new BadRequestException(
          `Requested quantity for product ${item.productId} exceeds available stock`,
        );
      }
    }

    for (const item of payload.items) {
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
    // console.log('After:', store.carts);
    return cart;
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    await this.getUser(userId);
    return store.carts.find((entry) => entry.userId === userId) ?? null;
  }
}
