import { Injectable, NotFoundException } from "@nestjs/common";
import { GenerateDiscountDto } from "./dto/generate-discount.dto";
import { AdminStats } from "./interfaces/admin-stats.interface";
import { store } from "src/shared/store/data.store";
import { User } from "src/shared/interfaces/user.interface";

@Injectable()
export class AdminRepository {
  async findById(userId: string): Promise<User | null> {
    const user = store.users.find((entry) => entry.id === userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async saveGeneratedDiscount(_payload: GenerateDiscountDto): Promise<void> {
    throw new Error("Not implemented");
  }

  async getStats(): Promise<AdminStats> {
    throw new Error("Not implemented");
  }
}
