import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Cart } from '../../shared/interfaces/cart.interface';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartsService } from './carts.service';

@Controller()
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post('cart')
  async addToCart(
    @Body() payload: AddToCartDto,
  ): Promise<{ message: string; data: Cart }> {
    const cart = await this.cartsService.addToCart(payload);

    return {
      message: 'Item added to cart successfully',
      data: cart,
    };
  }

  @Get('users/:userId/cart')
  async getUserCart(@Param('userId') userId: string): Promise<{ message: string; data: Cart | null }> {
    const userCart =  await this.cartsService.getUserCart(userId);

    return {
      message: 'User cart fetched successfully',
      data: userCart,
    }
  }
}
