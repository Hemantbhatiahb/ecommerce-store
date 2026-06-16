import { Body, Controller, Post } from '@nestjs/common';
import { Order } from '../../shared/interfaces/order.interface';
import { CheckoutDto } from './dto/checkout.dto';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  checkout(@Body() payload: CheckoutDto): Promise<Order> {
    return this.ordersService.checkout(payload);
  }
}
