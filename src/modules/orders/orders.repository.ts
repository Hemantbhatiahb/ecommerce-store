import { Injectable } from '@nestjs/common';
import { Order } from '../../shared/interfaces/order.interface';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class OrdersRepository {
  async createOrder(_payload: CheckoutDto): Promise<Order> {
    throw new Error('Not implemented');
  }
}
