import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsRepository } from './carts.repository';
import { CartsService } from './carts.service';
import { AdminRepository } from '../admin/admin.repository';

@Module({
  controllers: [CartsController],
  providers: [CartsService, CartsRepository, AdminRepository],
  exports: [CartsService],
})
export class CartsModule {}
