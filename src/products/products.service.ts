import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductsQueryDto } from './dto/find-products-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private async ensureCategoryExists(
    categoryId: number,
  ) {
    const category =
      await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

    if (!category) {
      throw new NotFoundException(
        'Category not found',
      );
    }
  }

  async create(dto: CreateProductDto) {
    await this.ensureCategoryExists(
      dto.categoryId,
    );

    return this.prisma.product.create({
      data: dto,
      include: { category: true },
    });
  }

  async findAll(
    query: FindProductsQueryDto,
  ) {
    if (
      query.minPrice !== undefined &&
      query.maxPrice !== undefined &&
      query.minPrice > query.maxPrice
    ) {
      throw new BadRequestException(
        'minPrice cannot be greater than maxPrice',
      );
    }

    if (
      query.minDiscount !== undefined &&
      query.maxDiscount !== undefined &&
      query.minDiscount > query.maxDiscount
    ) {
      throw new BadRequestException(
        'minDiscount cannot be greater than maxDiscount',
      );
    }

    const where: Prisma.ProductWhereInput = {};

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.search?.trim()) {
      const search = query.search.trim();

      where.OR = [
        {
          name: {
            contains: search,
          },
        },
        {
          description: {
            contains: search,
          },
        },
      ];
    }

    if (
      query.minPrice !== undefined ||
      query.maxPrice !== undefined
    ) {
      where.price = {
        gte: query.minPrice,
        lte: query.maxPrice,
      };
    }

    if (query.color?.trim()) {
      where.color = query.color.trim();
    }

    if (
      query.minDiscount !== undefined ||
      query.maxDiscount !== undefined
    ) {
      where.discountPercent = {
        gte: query.minDiscount,
        lte: query.maxDiscount,
      };
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 9;
    const skip = (page - 1) * limit;

    const orderBy = {
      [query.sortBy ?? 'id']:
        query.sortOrder ?? 'asc',
    } as Prisma.ProductOrderByWithRelationInput;

    const [total, items] =
      await this.prisma.$transaction([
        this.prisma.product.count({
          where,
        }),
        this.prisma.product.findMany({
          where,
          include: {
            category: true,
          },
          orderBy,
          skip,
          take: limit,
        }),
      ]);

    const totalPages =
      total === 0
        ? 0
        : Math.ceil(total / limit);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext:
          page < totalPages,
        hasPrevious:
          page > 1,
      },
    };
  }

  async findOne(id: number) {
    const product =
      await this.prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
        },
      });

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      );
    }

    return product;
  }

  async findSimilar(
    id: number,
    limit: number,
  ) {
    const product =
      await this.findOne(id);

    const candidates =
      await this.prisma.product.findMany({
        where: {
          categoryId:
            product.categoryId,
          id: {
            not: product.id,
          },
        },
        include: {
          category: true,
        },
        take: 50,
      });

    for (
      let index =
        candidates.length - 1;
      index > 0;
      index -= 1
    ) {
      const randomIndex =
        Math.floor(
          Math.random() *
            (index + 1),
        );

      [
        candidates[index],
        candidates[randomIndex],
      ] = [
        candidates[randomIndex],
        candidates[index],
      ];
    }

    return candidates.slice(
      0,
      limit,
    );
  }

  async update(
    id: number,
    dto: UpdateProductDto,
  ) {
    await this.findOne(id);

    if (dto.categoryId) {
      await this.ensureCategoryExists(
        dto.categoryId,
      );
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: {
        category: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.product.delete({
      where: { id },
    });

    return {
      message:
        'Product deleted successfully',
    };
  }
}
