import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async add(
    userId: number,
    dto: AddToCartDto,
  ) {
    const product =
      await this.prisma.product.findUnique({
        where: {
          id: dto.productId,
        },
      });

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      );
    }

    const quantity =
      dto.quantity ?? 1;

    const existingItem =
      await this.prisma.userCartItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId:
              dto.productId,
          },
        },
      });

    const nextQuantity =
      (existingItem?.quantity ?? 0) +
      quantity;

    if (
      nextQuantity >
      product.stock
    ) {
      throw new BadRequestException(
        'Requested quantity exceeds available stock',
      );
    }

    if (existingItem) {
      return this.prisma.userCartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity:
            nextQuantity,
        },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      });
    }

    return this.prisma.userCartItem.create({
      data: {
        userId,
        productId:
          dto.productId,
        quantity,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async findAll(
    userId: number,
  ) {
    const items =
      await this.prisma.userCartItem.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
        orderBy: {
          id: 'asc',
        },
      });

    let totalItems = 0;
    let subtotal = 0;
    let discount = 0;

    const detailedItems =
      items.map((item) => {
        const baseLineTotal =
          item.product.price *
          item.quantity;

        const lineDiscount =
          baseLineTotal *
          (item.product
            .discountPercent /
            100);

        const lineTotal =
          baseLineTotal -
          lineDiscount;

        totalItems +=
          item.quantity;

        subtotal +=
          baseLineTotal;

        discount +=
          lineDiscount;

        return {
          ...item,
          unitPrice:
            item.product.price,
          discountedUnitPrice:
            Number(
              (
                item.product.price *
                (1 -
                  item.product
                    .discountPercent /
                    100)
              ).toFixed(2),
            ),
          lineTotal:
            Number(
              lineTotal.toFixed(
                2,
              ),
            ),
        };
      });

    const totalPrice =
      subtotal - discount;

    return {
      items:
        detailedItems,
      totalItems,
      subtotal:
        Number(
          subtotal.toFixed(2),
        ),
      discount:
        Number(
          discount.toFixed(2),
        ),
      totalPrice:
        Number(
          totalPrice.toFixed(
            2,
          ),
        ),
    };
  }

  async update(
    userId: number,
    id: number,
    dto: UpdateCartItemDto,
  ) {
    const item =
      await this.prisma.userCartItem.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          product: true,
        },
      });

    if (!item) {
      throw new NotFoundException(
        'Cart item not found',
      );
    }

    if (
      dto.quantity >
      item.product.stock
    ) {
      throw new BadRequestException(
        'Requested quantity exceeds available stock',
      );
    }

    return this.prisma.userCartItem.update({
      where: { id },
      data: {
        quantity:
          dto.quantity,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async remove(
    userId: number,
    id: number,
  ) {
    const item =
      await this.prisma.userCartItem.findFirst({
        where: {
          id,
          userId,
        },
      });

    if (!item) {
      throw new NotFoundException(
        'Cart item not found',
      );
    }

    await this.prisma.userCartItem.delete({
      where: { id },
    });

    return {
      message:
        'Cart item removed successfully',
    };
  }

  async clear(
    userId: number,
  ) {
    await this.prisma.userCartItem.deleteMany({
      where: { userId },
    });

    return {
      message:
        'Cart cleared successfully',
    };
  }
}
