import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
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
    description: 'Product price',
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

  @ApiProperty({
    example: 1,
    description: 'Existing category id',
  })
  @IsInt()
  @Min(1)
  categoryId: number;
}
