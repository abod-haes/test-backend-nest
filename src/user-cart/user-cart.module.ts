import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserCartController } from './user-cart.controller';
import { UserCartService } from './user-cart.service';

@Module({
  imports: [AuthModule],
  controllers: [UserCartController],
  providers: [UserCartService],
})
export class UserCartModule {}
