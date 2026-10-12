import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductsQueryDto } from './dto/find-products-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product (ADMIN only)' })
  @ApiCreatedResponse({ description: 'Product created' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiForbiddenResponse({ description: 'ADMIN role required' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products (public)',
    description:
      'Use categoryId to filter products, for example: /api/products?categoryId=1',
  })
  findAll(@Query() query: FindProductsQueryDto) {
    return this.productsService.findAll(query.categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one product (public)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiNotFoundResponse({ description: 'Product not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product (ADMIN only)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ description: 'Product updated' })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiForbiddenResponse({ description: 'ADMIN role required' })
  @ApiNotFoundResponse({ description: 'Product or category not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product (ADMIN only)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({
    schema: { example: { message: 'Product deleted successfully' } },
  })
  @ApiUnauthorizedResponse({ description: 'Login required' })
  @ApiForbiddenResponse({ description: 'ADMIN role required' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
