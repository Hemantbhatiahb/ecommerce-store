import { Injectable } from '@nestjs/common';
import { GenerateDiscountDto } from './dto/generate-discount.dto';
import { AdminStats } from './interfaces/admin-stats.interface';

@Injectable()
export class AdminRepository {
  async saveGeneratedDiscount(_payload: GenerateDiscountDto): Promise<void> {
    throw new Error('Not implemented');
  }

  async getStats(): Promise<AdminStats> {
    throw new Error('Not implemented');
  }
}
