import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from './auth-user.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization as string | undefined;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing access token');
    }

    const token = authorization.split(' ')[1];

    try {
      const payload = await this.jwtService.verifyAsync<AuthUser>(token, {
        secret: process.env.JWT_SECRET ?? 'training-jwt-secret',
      });

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
