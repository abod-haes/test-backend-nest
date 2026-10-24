import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

type AuthRequest = {
  user: {
    sub: number;
  };
};

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService:
      CartService,
  ) {}

  @Post()
  @ApiOperation({
    summary:
      'Add a product to the logged-in user cart',
    description:
      'If the product already exists in this user cart, quantity is increased.',
  })
  @ApiCreatedResponse({
    description:
      'Product added to cart',
  })
  @ApiUnauthorizedResponse({
    description:
      'Login required',
  })
  @ApiNotFoundResponse({
    description:
      'Product not found',
  })
  add(
    @Request()
    request: AuthRequest,
    @Body()
    dto: AddToCartDto,
  ) {
    return this.cartService.add(
      request.user.sub,
      dto,
    );
  }

  @Get()
  @ApiOperation({
    summary:
      'Get the logged-in user cart and totals',
  })
  findAll(
    @Request()
    request: AuthRequest,
  ) {
    return this.cartService.findAll(
      request.user.sub,
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary:
      'Change one cart item quantity',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description:
      'User cart item id',
  })
  update(
    @Request()
    request: AuthRequest,
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
    @Body()
    dto:
      UpdateCartItemDto,
  ) {
    return this.cartService.update(
      request.user.sub,
      id,
      dto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary:
      'Remove one item from the logged-in user cart',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  remove(
    @Request()
    request: AuthRequest,
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.cartService.remove(
      request.user.sub,
      id,
    );
  }

  @Delete()
  @ApiOperation({
    summary:
      'Clear the logged-in user cart',
  })
  @ApiOkResponse({
    schema: {
      example: {
        message:
          'Cart cleared successfully',
      },
    },
  })
  clear(
    @Request()
    request: AuthRequest,
  ) {
    return this.cartService.clear(
      request.user.sub,
    );
  }
}
