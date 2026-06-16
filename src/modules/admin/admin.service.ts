import { Injectable } from '@nestjs/common';
import { GenerateDiscountDto } from './dto/generate-discount.dto';
import { AdminRepository } from './admin.repository';
import { AdminStats } from './interfaces/admin-stats.interface';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  generateDiscount(payload: GenerateDiscountDto): Promise<void> {
    return this.adminRepository.saveGeneratedDiscount(payload);
  }

  getStats(): Promise<AdminStats> {
    return this.adminRepository.getStats();
  }
}
