import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { Product } from '../../shared/interfaces/product.interface';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProducts(): Promise<{ message: string; data: Product[] }> {
    const products = await this.productsService.getProducts();

    return {
      message: 'Products fetched successfully',
      data: products,
    };
  }
}
