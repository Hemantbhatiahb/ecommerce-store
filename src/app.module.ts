import { Module } from '@nestjs/common';
import { AdminModule } from './modules/admin/admin.module';
import { CartsModule } from './modules/carts/carts.module';
import { DiscountsModule } from './modules/discounts/discounts.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [ProductsModule, CartsModule, OrdersModule, DiscountsModule, AdminModule],
})
export class AppModule {}
