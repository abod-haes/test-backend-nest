import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Stylish Soft Chair',
    description: 'Product name',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'A comfortable soft chair for modern living rooms.',
    description: 'Product description',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    example: 20,
    description: 'Base product price before discount',
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiPropertyOptional({
    example: 'https://placehold.co/600x400?text=Chair',
    description: 'Optional image URL or image path',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: 'Gray',
    description: 'Color family used by storefront filters',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;

  @ApiPropertyOptional({
    example: 20,
    default: 0,
    description: 'Discount percentage from 0 to 100',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  discountPercent?: number = 0;

  @ApiPropertyOptional({
    example: 25,
    default: 100,
    description: 'Available stock',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number = 100;

  @ApiProperty({
    example: 1,
    description: 'Existing category id',
  })
  @IsInt()
  @Min(1)
  categoryId: number;
}
