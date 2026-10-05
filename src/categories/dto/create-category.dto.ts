import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Living Room',
    description: 'Category name',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({
    example: 'Sofas, chairs and living room furniture',
    description: 'Optional category description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;
}
