import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { CategoriesModule } from './categories/categories.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [PrismaModule, CategoriesModule, ProductsModule, CartModule],
})
export class AppModule {}
