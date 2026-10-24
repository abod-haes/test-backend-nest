import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CheckoutDto {
  @ApiProperty({
    example: 'Ahmad Ali',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  shippingName: string;

  @ApiProperty({
    example: 'Mirpur-10, Road 14A',
  })
  @IsString()
  @MinLength(5)
  @MaxLength(300)
  shippingAddress: string;

  @ApiPropertyOptional({
    example: 'Dhaka',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  shippingCity?: string;

  @ApiProperty({
    example: '0175817028',
  })
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  shippingPhone: string;

  @ApiProperty({
    example: 'CASH',
    enum: ['CASH', 'CARD'],
    description:
      'CARD records the selected payment method only. Raw card number/CVV must not be stored by this API.',
  })
  @IsIn([
    'CASH',
    'CARD',
  ])
  paymentMethod:
    | 'CASH'
    | 'CARD';

  @ApiPropertyOptional({
    example: 'SAVE20',
    description:
      'Training promo code. SAVE20 applies an extra 20% discount.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  promoCode?: string;
}
