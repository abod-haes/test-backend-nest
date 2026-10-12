import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  hashPassword,
  verifyPassword,
} from './password.util';
import {
  USER_ROLES,
  UserRole,
} from './roles';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma:
      PrismaService,

    private readonly tokenService:
      TokenService,
  ) {}

  async register(
    dto: RegisterDto,
  ) {
    const existingUser =
      await this.prisma.user
        .findUnique({
          where: {
            email: dto.email,
          },
        });

    if (existingUser) {
      throw new ConflictException(
        'Email already exists',
      );
    }

    const user =
      await this.prisma.user
        .create({
          data: {
            name: dto.name,
            email: dto.email,
            password:
              hashPassword(
                dto.password,
              ),
            role:
              USER_ROLES.USER,
          },
        });

    return this.createAuthResponse(
      user,
    );
  }

  async login(
    dto: LoginDto,
  ) {
    const user =
      await this.prisma.user
        .findUnique({
          where: {
            email: dto.email,
          },
        });

    if (
      !user ||
      !verifyPassword(
        dto.password,
        user.password,
      )
    ) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    return this.createAuthResponse(
      user,
    );
  }

  async me(
    userId: number,
  ) {
    return this.prisma.user
      .findUniqueOrThrow({
        where: {
          id: userId,
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
  }

  private createAuthResponse(
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    },
  ) {
    const role: UserRole =
      user.role ===
      USER_ROLES.ADMIN
        ? USER_ROLES.ADMIN
        : USER_ROLES.USER;

    const accessToken =
      this.tokenService.sign({
        sub: user.id,
        name: user.name,
        email: user.email,
        role,
      });

    return {
      accessToken,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
      },
    };
  }
}
