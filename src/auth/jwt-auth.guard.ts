import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from './token.service';

@Injectable()
export class JwtAuthGuard
  implements CanActivate
{
  constructor(
    private readonly tokenService:
      TokenService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ) {
    const request =
      context
        .switchToHttp()
        .getRequest();

    const authorization =
      request.headers
        .authorization as
        | string
        | undefined;

    if (
      !authorization?.startsWith(
        'Bearer ',
      )
    ) {
      throw new UnauthorizedException(
        'Missing access token',
      );
    }

    const token =
      authorization.split(' ')[1];

    request.user =
      this.tokenService.verify(
        token,
      );

    return true;
  }
}
