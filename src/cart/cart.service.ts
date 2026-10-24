import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async add(dto: AddToCartDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const quantity = dto.quantity ?? 1;

    const existingItem = await this.prisma.cartItem.findUnique({
      where: { productId: dto.productId },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: {
            include: { category: true },
          },
        },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        productId: dto.productId,
        quantity,
      },
      include: {
        product: {
          include: { category: true },
        },
      },
    });
  }

  async findAll() {
    const items = await this.prisma.cartItem.findMany({
      include: {
        product: {
          include: { category: true },
        },
      },
      orderBy: { id: 'asc' },
    });

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    return {
      items,
      totalItems,
      totalPrice: Number(totalPrice.toFixed(2)),
    };
  }

  async update(id: number, dto: UpdateCartItemDto) {
    const item = await this.prisma.cartItem.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    return this.prisma.cartItem.update({
      where: { id },
      data: { quantity: dto.quantity },
      include: {
        product: {
          include: { category: true },
        },
      },
    });
  }

  async remove(id: number) {
    const item = await this.prisma.cartItem.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({ where: { id } });

    return { message: 'Cart item removed successfully' };
  }

  async clear() {
    await this.prisma.cartItem.deleteMany();

    return { message: 'Cart cleared successfully' };
  }
}
