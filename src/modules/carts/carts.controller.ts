import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Cart } from '../../shared/interfaces/cart.interface';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartsService } from './carts.service';

@Controller()
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post('cart')
  addToCart(@Body() payload: AddToCartDto): Promise<Cart> {
    return this.cartsService.addToCart(payload);
  }

  @Get('users/:userId/cart')
  getUserCart(@Param('userId') userId: string): Promise<Cart | null> {
    return this.cartsService.getUserCart(userId);
  }
}
