import { Injectable } from '@nestjs/common';
import { Product } from '../../shared/interfaces/product.interface';

@Injectable()
export class ProductsRepository {
  async findAll(): Promise<Product[]> {
    throw new Error('Not implemented');
  }
}
