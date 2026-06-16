import { UserRole } from '../constants/roles.constants';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
