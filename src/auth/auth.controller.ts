import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
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
import { RolesGuard } from './roles.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new USER account' })
  @ApiCreatedResponse({
    schema: {
      example: {
        accessToken: 'jwt-token',
        user: {
          id: 3,
          name: 'Abdulrahman',
          email: 'student2@example.com',
          role: 'USER',
        },
      },
    },
  })
  @ApiConflictResponse({ description: 'Email already exists' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and receive an access token' })
  @ApiOkResponse({
    schema: {
      example: {
        accessToken: 'jwt-token',
        user: {
          id: 1,
          name: 'Training Admin',
          email: 'admin@example.com',
          role: 'ADMIN',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the logged-in user' })
  @ApiOkResponse({
    schema: {
      example: {
        id: 1,
        name: 'Training Admin',
        email: 'admin@example.com',
        role: 'ADMIN',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  me(@Request() request: { user: { sub: number } }) {
    return this.authService.me(request.user.sub);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Simple ADMIN-only endpoint for 403 training' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Welcome Admin',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiForbiddenResponse({ description: 'ADMIN role required' })
  adminOnly() {
    return {
      message: 'Welcome Admin',
    };
  }
}
