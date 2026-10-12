import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService:
      AuthService,
  ) {}

  @Post('login')
  @ApiOperation({
    summary:
      'Login and receive an access token',
  })
  @ApiOkResponse({
    description:
      'Login successful',
  })
  @ApiUnauthorizedResponse({
    description:
      'Invalid email or password',
  })
  login(
    @Body()
    dto: LoginDto,
  ) {
    return this.authService
      .login(dto);
  }

  @Get('me')
  @UseGuards(
    JwtAuthGuard,
  )
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Get the logged-in user',
  })
  @ApiOkResponse({
    description:
      'Current user',
  })
  @ApiUnauthorizedResponse({
    description:
      'Missing or invalid access token',
  })
  me(
    @Request()
    request: {
      user: {
        sub: number;
      };
    },
  ) {
    return this.authService
      .me(
        request.user.sub,
      );
  }
}
