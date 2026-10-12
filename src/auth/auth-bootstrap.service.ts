import {
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from './password.util';
import { USER_ROLES } from './roles';

@Injectable()
export class AuthBootstrapService
  implements OnModuleInit
{
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  async onModuleInit() {
    await this.ensureUser({
      name: 'Training Admin',
      email: 'admin@example.com',
      password: 'Admin123!',
      role: USER_ROLES.ADMIN,
    });

    await this.ensureUser({
      name: 'Training Student',
      email: 'student@example.com',
      password: 'Student123!',
      role: USER_ROLES.USER,
    });
  }

  private async ensureUser(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) {
    const existingUser =
      await this.prisma.user
        .findUnique({
          where: {
            email: data.email,
          },
        });

    if (existingUser) {
      return;
    }

    await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password:
          hashPassword(
            data.password,
          ),
        role: data.role,
      },
    });
  }
}
