import { Injectable } from "@nestjs/common";
import { Order } from "../../shared/interfaces/order.interface";
import { store } from "../../shared/store/data.store";

@Injectable()
export class OrdersRepository {
  async save(order: Order): Promise<Order> {
    store.orders.push(order);
    return order;
  }

  async count(): Promise<number> {
    return store.orders.length;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return store.orders.filter((order) => order.userId === userId);
  }
}
