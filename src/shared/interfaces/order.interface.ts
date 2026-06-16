import { CartItem } from './cart-item.interface';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  createdAt: string;
}
