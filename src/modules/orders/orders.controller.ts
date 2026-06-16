import { Body, Controller, Post } from "@nestjs/common";
import { Order } from "../../shared/interfaces/order.interface";
import { CheckoutDto } from "./dto/checkout.dto";
import { OrdersService } from "./orders.service";
import { Coupon } from "src/shared/interfaces/coupon.interface";

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post("checkout")
  async checkout(@Body() payload: CheckoutDto): Promise<{
    message: string;
    data: {
      order: Order;
      earnedCoupon: Coupon | null;
    };
  }> {
    const order = await this.ordersService.checkout(payload);

    return {
      message: "Order placed successfully",
      data: order,
    };
  }
}
