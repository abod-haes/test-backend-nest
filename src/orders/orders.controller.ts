import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CheckoutDto } from './dto/checkout.dto';
import { OrdersService } from './orders.service';

type AuthRequest = {
  user: {
    sub: number;
  };
};

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService:
      OrdersService,
  ) {}

  @Post('checkout')
  @ApiOperation({
    summary:
      'Checkout the logged-in user cart and create an order',
    description:
      'Creates an order snapshot, decreases stock and clears the user cart. Raw card data is intentionally not stored.',
  })
  @ApiCreatedResponse({
    description:
      'Order created successfully',
  })
  @ApiUnauthorizedResponse({
    description:
      'Login required',
  })
  checkout(
    @Request()
    request: AuthRequest,
    @Body()
    dto: CheckoutDto,
  ) {
    return this.ordersService.checkout(
      request.user.sub,
      dto,
    );
  }

  @Get()
  @ApiOperation({
    summary:
      'Get orders for the logged-in user',
  })
  findAll(
    @Request()
    request: AuthRequest,
  ) {
    return this.ordersService.findAll(
      request.user.sub,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary:
      'Get one order for the logged-in user',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  findOne(
    @Request()
    request: AuthRequest,
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.ordersService.findOne(
      request.user.sub,
      id,
    );
  }
}
