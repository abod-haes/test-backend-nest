import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({
    summary: 'Add a product to cart',
    description:
      'If the product is already in the cart, its quantity will be increased.',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        id: 1,
        productId: 1,
        quantity: 2,
        product: {
          id: 1,
          name: 'Stylish Soft Chair',
          description: 'A comfortable soft chair for modern living rooms.',
          price: 20,
          categoryId: 1,
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  add(@Body() dto: AddToCartDto) {
    return this.cartService.add(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get cart items and totals' })
  @ApiOkResponse({
    schema: {
      example: {
        items: [
          {
            id: 1,
            productId: 1,
            quantity: 2,
            product: {
              id: 1,
              name: 'Stylish Soft Chair',
              price: 20,
            },
          },
        ],
        totalItems: 2,
        totalPrice: 40,
      },
    },
  })
  findAll() {
    return this.cartService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Change cart item quantity' })
  @ApiParam({ name: 'id', example: 1, description: 'Cart item id' })
  @ApiOkResponse({ description: 'Cart item quantity updated' })
  @ApiNotFoundResponse({ description: 'Cart item not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove one item from cart' })
  @ApiParam({ name: 'id', example: 1, description: 'Cart item id' })
  @ApiOkResponse({
    schema: { example: { message: 'Cart item removed successfully' } },
  })
  @ApiNotFoundResponse({ description: 'Cart item not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.remove(id);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear the whole cart' })
  @ApiOkResponse({
    schema: { example: { message: 'Cart cleared successfully' } },
  })
  clear() {
    return this.cartService.clear();
  }
}
