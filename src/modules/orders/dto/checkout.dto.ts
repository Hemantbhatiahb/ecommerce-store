import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CheckoutDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsOptional()
  @IsString()
  couponCode?: string;
}