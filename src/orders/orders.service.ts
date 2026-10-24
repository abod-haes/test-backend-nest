import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async checkout(
    userId: number,
    dto: CheckoutDto,
  ) {
    const cartItems =
      await this.prisma.userCartItem.findMany({
        where: { userId },
        include: {
          product: true,
        },
        orderBy: {
          id: 'asc',
        },
      });

    if (
      cartItems.length === 0
    ) {
      throw new BadRequestException(
        'Cart is empty',
      );
    }

    for (
      const item of cartItems
    ) {
      if (
        item.quantity >
        item.product.stock
      ) {
        throw new BadRequestException(
          `Not enough stock for ${item.product.name}`,
        );
      }
    }

    const promoCode =
      dto.promoCode
        ?.trim()
        .toUpperCase();

    if (
      promoCode &&
      promoCode !== 'SAVE20'
    ) {
      throw new BadRequestException(
        'Invalid promo code',
      );
    }

    const subtotal =
      cartItems.reduce(
        (sum, item) =>
          sum +
          item.product.price *
            item.quantity,
        0,
      );

    const productDiscount =
      cartItems.reduce(
        (sum, item) =>
          sum +
          item.product.price *
            item.quantity *
            (item.product
              .discountPercent /
              100),
        0,
      );

    const afterProductDiscount =
      subtotal -
      productDiscount;

    const promoDiscount =
      promoCode === 'SAVE20'
        ? afterProductDiscount *
          0.2
        : 0;

    const deliveryFee = 24;

    const total =
      afterProductDiscount -
      promoDiscount +
      deliveryFee;

    return this.prisma.$transaction(
      async (tx) => {
        const order =
          await tx.order.create({
            data: {
              userId,
              status: 'PLACED',
              paymentMethod:
                dto.paymentMethod,
              shippingName:
                dto.shippingName,
              shippingAddress:
                dto.shippingAddress,
              shippingCity:
                dto.shippingCity,
              shippingPhone:
                dto.shippingPhone,
              promoCode:
                promoCode || null,
              subtotal:
                Number(
                  subtotal.toFixed(
                    2,
                  ),
                ),
              productDiscount:
                Number(
                  productDiscount.toFixed(
                    2,
                  ),
                ),
              promoDiscount:
                Number(
                  promoDiscount.toFixed(
                    2,
                  ),
                ),
              deliveryFee,
              total:
                Number(
                  total.toFixed(2),
                ),
              items: {
                create:
                  cartItems.map(
                    (item) => {
                      const lineTotal =
                        item.product
                          .price *
                        item.quantity *
                        (1 -
                          item.product
                            .discountPercent /
                            100);

                      return {
                        productId:
                          item.product
                            .id,
                        productName:
                          item.product
                            .name,
                        imageUrl:
                          item.product
                            .imageUrl,
                        unitPrice:
                          item.product
                            .price,
                        discountPercent:
                          item.product
                            .discountPercent,
                        quantity:
                          item.quantity,
                        lineTotal:
                          Number(
                            lineTotal.toFixed(
                              2,
                            ),
                          ),
                      };
                    },
                  ),
              },
            },
            include: {
              items: true,
            },
          });

        for (
          const item of cartItems
        ) {
          await tx.product.update({
            where: {
              id: item.productId,
            },
            data: {
              stock: {
                decrement:
                  item.quantity,
              },
            },
          });
        }

        await tx.userCartItem.deleteMany({
          where: { userId },
        });

        return order;
      },
    );
  }

  findAll(
    userId: number,
  ) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(
    userId: number,
    id: number,
  ) {
    const order =
      await this.prisma.order.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          items: true,
        },
      });

    if (!order) {
      throw new NotFoundException(
        'Order not found',
      );
    }

    return order;
  }
}
