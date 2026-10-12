import { UserRole } from './roles';

export interface AuthUser {
  sub: number;
  name: string;
  email: string;
  role: UserRole;
}
