import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ProductColor } from '../product-color.enum';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class FindProductsQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Filter products by category id',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId?: number;

  @ApiPropertyOptional({
    example: 'sofa',
    description: 'Search in product name and description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    enum: ProductColor,
    enumName: 'ProductColor',
    example: ProductColor.GRAY,
    description: 'Filter by one supported color family',
  })
  @IsOptional()
  @IsEnum(ProductColor)
  color?: ProductColor;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  minDiscount?: number;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  maxDiscount?: number;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    example: 9,
    default: 9,
    maximum: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 9;

  @ApiPropertyOptional({
    example: 'price',
    enum: ['id', 'name', 'price', 'discountPercent', 'createdAt'],
  })
  @IsOptional()
  @IsIn([
    'id',
    'name',
    'price',
    'discountPercent',
    'createdAt',
  ])
  sortBy: 'id' | 'name' | 'price' | 'discountPercent' | 'createdAt' = 'id';

  @ApiPropertyOptional({
    example: 'asc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'asc';
}
