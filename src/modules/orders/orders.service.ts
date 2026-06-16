import { Injectable } from '@nestjs/common';
import { Order } from '../../shared/interfaces/order.interface';
import { CheckoutDto } from './dto/checkout.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  checkout(payload: CheckoutDto): Promise<Order> {
    return this.ordersRepository.createOrder(payload);
  }
}
