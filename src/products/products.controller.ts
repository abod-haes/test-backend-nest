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
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductsQueryDto } from './dto/find-products-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a product' })
  @ApiCreatedResponse({
    description: 'Product created',
    schema: {
      example: {
        id: 1,
        name: 'Stylish Soft Chair',
        description: 'A comfortable soft chair for modern living rooms.',
        price: 20,
        imageUrl: 'https://placehold.co/600x400?text=Chair',
        categoryId: 1,
        category: { id: 1, name: 'Living Room' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Category not found' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description:
      'Use categoryId to filter products, for example: /api/products?categoryId=1',
  })
  @ApiOkResponse({
    schema: {
      example: [
        {
          id: 1,
          name: 'Stylish Soft Chair',
          description: 'A comfortable soft chair for modern living rooms.',
          price: 20,
          imageUrl: 'https://placehold.co/600x400?text=Chair',
          categoryId: 1,
          category: { id: 1, name: 'Living Room' },
        },
      ],
    },
  })
  findAll(@Query() query: FindProductsQueryDto) {
    return this.productsService.findAll(query.categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one product' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiNotFoundResponse({ description: 'Product not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ description: 'Product updated' })
  @ApiNotFoundResponse({ description: 'Product or category not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({
    schema: { example: { message: 'Product deleted successfully' } },
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
