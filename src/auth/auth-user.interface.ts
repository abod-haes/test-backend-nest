import { Role } from '@prisma/client';

export interface AuthUser {
  sub: number;
  name: string;
  email: string;
  role: Role;
}
