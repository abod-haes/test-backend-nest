import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import {
  hashPassword,
  verifyPassword,
} from './password.util';
import {
  USER_ROLES,
  UserRole,
} from './roles';
import { TokenService } from './token.service';

type TrainingUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
};

@Injectable()
export class AuthService {
  private readonly users: TrainingUser[] = [
    {
      id: 1,
      name: 'Training Admin',
      email: 'admin@example.com',
      password:
        hashPassword(
          'Admin123!',
        ),
      role:
        USER_ROLES.ADMIN,
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'Training Student',
      email: 'student@example.com',
      password:
        hashPassword(
          'Student123!',
        ),
      role:
        USER_ROLES.USER,
      createdAt: new Date(),
    },
  ];

  constructor(
    private readonly tokenService:
      TokenService,
  ) {}

  login(
    dto: LoginDto,
  ) {
    const user =
      this.users.find(
        (item) =>
          item.email ===
          dto.email,
      );

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

  me(
    userId: number,
  ) {
    const user =
      this.users.find(
        (item) =>
          item.id === userId,
      );

    if (!user) {
      throw new UnauthorizedException(
        'User not found',
      );
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  private createAuthResponse(
    user: TrainingUser,
  ) {
    const accessToken =
      this.tokenService.sign({
        sub: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });

    return {
      accessToken,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
