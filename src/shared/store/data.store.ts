import { USER_ROLES } from '../constants/roles.constants';
import { Cart } from '../interfaces/cart.interface';
import { Coupon } from '../interfaces/coupon.interface';
import { Order } from '../interfaces/order.interface';
import { Product } from '../interfaces/product.interface';
import { User } from '../interfaces/user.interface';

export interface DataStore {
  users: User[];
  products: Product[];
  carts: Cart[];
  orders: Order[];
  coupons: Coupon[];
}

export const store: DataStore = {
  users: [
    {
      id: 'u-1001',
      name: 'Hemant Bhatia',
      email: 'hemant.bhatia@gmail.com',
      role: USER_ROLES.CUSTOMER,
    },
    {
      id: 'u-1002',
      name: 'Test User',
      email: 'test@gmail.com',
      role: USER_ROLES.CUSTOMER,
    },
    {
      id: 'a-1001',
      name: 'Admin User',
      email: 'admin@gmail.com',
      role: USER_ROLES.ADMIN,
    },
  ],
  products: [
    {
      id: 'p-2001',
      name: 'Wireless Mouse',
      price: 29.99,
      stock: 100,
    },
    {
      id: 'p-2002',
      name: 'Mechanical Keyboard',
      price: 89.99,
      stock: 50,
    },
    {
      id: 'p-2003',
      name: 'USB-C Hub',
      price: 49.99,
      stock: 75,
    },
  ],
  carts: [],
  orders: [],
  coupons: [],
};
