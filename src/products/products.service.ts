import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureCategoryExists(categoryId: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }
  }

  async create(dto: CreateProductDto) {
    await this.ensureCategoryExists(dto.categoryId);

    return this.prisma.product.create({
      data: dto,
      include: { category: true },
    });
  }

  findAll(categoryId?: number) {
    return this.prisma.product.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: { category: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);

    if (dto.categoryId) {
      await this.ensureCategoryExists(dto.categoryId);
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.product.delete({ where: { id } });

    return { message: 'Product deleted successfully' };
  }
}
