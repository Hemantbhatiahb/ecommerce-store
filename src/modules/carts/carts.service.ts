import { Injectable, NotFoundException } from "@nestjs/common";
import { AdminRepository } from "../admin/admin.repository";
import { CartsRepository } from "./carts.repository";
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { CartItemDto } from "./dto/add-to-cart.dto";
import { Cart } from "../../shared/interfaces/cart.interface";
import { store } from "../../shared/store/data.store";

@Injectable()
export class CartsService {
  constructor(
    private readonly cartsRepository: CartsRepository,
    private readonly adminRepository: AdminRepository,
  ) {}

  async addToCart(payload: AddToCartDto): Promise<Cart> {
    await this.adminRepository.findById(payload.userId);

    this.validateProducts(payload.items);

    return this.cartsRepository.upsertCartItem(payload.userId, payload.items);
  }

  async getUserCart(userId: string): Promise<Cart | null> {
    await this.adminRepository.findById(userId);

    return this.cartsRepository.findByUserId(userId);
  }

  private validateProducts(items: CartItemDto[]) {
    const productIds = items.map((item) => item.productId);

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

    return new Map(products.map((product) => [product.id, product]));
  }
}
