import { IsNotEmpty, IsString, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class GenerateDiscountDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  percentage!: number;
}
