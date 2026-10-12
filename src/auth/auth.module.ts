import { Module } from '@nestjs/common';
import { AuthBootstrapService } from './auth-bootstrap.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { TokenService } from './token.service';

@Module({
  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
    TokenService,
    JwtAuthGuard,
    RolesGuard,
    AuthBootstrapService,
  ],

  exports: [
    TokenService,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class AuthModule {}
