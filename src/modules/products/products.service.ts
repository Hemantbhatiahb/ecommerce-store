import { Injectable } from '@nestjs/common';
import { Product } from '../../shared/interfaces/product.interface';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  getProducts(): Promise<Product[]> {
    return this.productsRepository.findAll();
  }
}
