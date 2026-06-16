import { Injectable } from '@nestjs/common';
import { Product } from '../../shared/interfaces/product.interface';
import { store } from '../../shared/store/data.store';

@Injectable()
export class ProductsRepository {
  async findAll(): Promise<Product[]> {
    return store.products;
  }
}
