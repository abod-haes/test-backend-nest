import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({
    example: 1,
    description: 'Product id to add to the cart',
  })
  @IsInt()
  @Min(1)
  productId: number;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Quantity to add',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number = 1;
}
