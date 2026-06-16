import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersRepository } from "./orders.repository";
import { OrdersService } from "./orders.service";
import { AdminRepository } from "../admin/admin.repository";
import { DiscountsRepository } from "../discounts/discounts.repository";
import { CartsRepository } from "../carts/carts.repository";

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrdersRepository,
    AdminRepository,
    DiscountsRepository,
    CartsRepository,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
