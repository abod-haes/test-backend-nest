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
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { USER_ROLES } from './roles';
import { RolesGuard } from './roles.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService:
      AuthService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary:
      'Register a new USER account',
  })
  @ApiCreatedResponse({
    description:
      'Account created',
  })
  @ApiConflictResponse({
    description:
      'Email already exists',
  })
  register(
    @Body()
    dto: RegisterDto,
  ) {
    return this.authService
      .register(dto);
  }

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

  @Get('admin')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    USER_ROLES.ADMIN,
  )
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Simple ADMIN-only endpoint for 403 training',
  })
  @ApiOkResponse({
    schema: {
      example: {
        message:
          'Welcome Admin',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description:
      'Missing or invalid access token',
  })
  @ApiForbiddenResponse({
    description:
      'ADMIN role required',
  })
  adminOnly() {
    return {
      message:
        'Welcome Admin',
    };
  }
}
