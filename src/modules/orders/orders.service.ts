import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AdminRepository } from "../admin/admin.repository";
import { CartsRepository } from "../carts/carts.repository";
import { DiscountsRepository } from "../discounts/discounts.repository";
import { OrdersRepository } from "./orders.repository";
import { CheckoutDto } from "./dto/checkout.dto";

import { Order } from "../../shared/interfaces/order.interface";
import { Coupon } from "../../shared/interfaces/coupon.interface";

import { store } from "../../shared/store/data.store";
import { DISCOUNT_CONFIG } from "../../shared/constants/app.constants";

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly cartsRepository: CartsRepository,
    private readonly discountsRepository: DiscountsRepository,
    private readonly adminRepository: AdminRepository,
  ) {}

  async checkout(payload: CheckoutDto): Promise<{
    order: Order;
    earnedCoupon: Coupon | null;
  }> {
    await this.adminRepository.findById(payload.userId);

    const cart = await this.cartsRepository.findByUserId(payload.userId);

    if (!cart || cart.items.length === 0) {
      throw new NotFoundException("Cart is empty");
    }

    let subtotal = 0;

    for (const item of cart.items) {
      const product = store.products.find(
        (entry) => entry.id === item.productId,
      );

      if (!product) {
        throw new NotFoundException(`Product not found: ${item.productId}`);
      }

      if (item.quantity > product.stock) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}`,
        );
      }

      subtotal += product.price * item.quantity;
    }

    // Apply discount if coupon code is provided
    let discountPercentage = 0;

    if (payload.couponCode) {
      const coupon = await this.discountsRepository.findValidCoupon(
        payload.couponCode,
        payload.userId,
      );

      discountPercentage = coupon.percentage;

      await this.discountsRepository.markAsUsed(payload.couponCode);
    }

    const total = subtotal - (subtotal * discountPercentage) / 100;

    const order: Order = {
      id: `order_${Date.now()}`,
      userId: payload.userId,
      items: [...cart.items],
      subtotal,
      discount: discountPercentage,
      total,
      createdAt: new Date().toISOString(),
    };

    // create order and empty cart
    await this.ordersRepository.save(order);

    await this.cartsRepository.clearCart(payload.userId);

    let earnedCoupon: Coupon | null = null;

    const orderCount = await this.ordersRepository.count();

    // Earn a coupon for every Nth order
    if (orderCount % DISCOUNT_CONFIG.EVERY_NTH_ORDER === 0) {
      earnedCoupon = {
        code: `SAVE${DISCOUNT_CONFIG.DISCOUNT_PERCENTAGE}`,
        userId: payload.userId,
        percentage: DISCOUNT_CONFIG.DISCOUNT_PERCENTAGE,
        isUsed: false,
      };

      await this.discountsRepository.save(earnedCoupon);
    }

    return {
      order,
      earnedCoupon,
    };
  }
}
