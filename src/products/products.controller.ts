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
import { USER_ROLES } from '../auth/roles';
import { RolesGuard } from '../auth/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductsQueryDto } from './dto/find-products-query.dto';
import { SimilarProductsQueryDto } from './dto/similar-products-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService:
      ProductsService,
  ) {}

  @Post()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    USER_ROLES.ADMIN,
  )
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Create a product (ADMIN only)',
  })
  @ApiCreatedResponse({
    description:
      'Product created',
  })
  @ApiUnauthorizedResponse({
    description:
      'Login required',
  })
  @ApiForbiddenResponse({
    description:
      'ADMIN role required',
  })
  @ApiNotFoundResponse({
    description:
      'Category not found',
  })
  create(
    @Body()
    dto: CreateProductDto,
  ) {
    return this.productsService
      .create(dto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Get storefront products with filters and pagination',
    description:
      'Supports categoryId, search, price range, color, discount range, sorting, page and limit.',
  })
  findAll(
    @Query()
    query:
      FindProductsQueryDto,
  ) {
    return this.productsService
      .findAll(query);
  }

  @Get('colors')
  @ApiOperation({
    summary: 'List supported product colors for filter controls',
  })
  @ApiOkResponse({
    description: 'Available color enum values, labels, and swatch hex codes',
  })
  getColors() {
    return this.productsService.getColors();
  }

  @Get(':id/similar')
  @ApiOperation({
    summary:
      'Get random similar products from the same category',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  findSimilar(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
    @Query()
    query:
      SimilarProductsQueryDto,
  ) {
    return this.productsService
      .findSimilar(
        id,
        query.limit,
      );
  }

  @Get(':id')
  @ApiOperation({
    summary:
      'Get one product (public)',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiNotFoundResponse({
    description:
      'Product not found',
  })
  findOne(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.productsService
      .findOne(id);
  }

  @Patch(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    USER_ROLES.ADMIN,
  )
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Update a product (ADMIN only)',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiOkResponse({
    description:
      'Product updated',
  })
  @ApiUnauthorizedResponse({
    description:
      'Login required',
  })
  @ApiForbiddenResponse({
    description:
      'ADMIN role required',
  })
  @ApiNotFoundResponse({
    description:
      'Product or category not found',
  })
  update(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
    @Body()
    dto: UpdateProductDto,
  ) {
    return this.productsService
      .update(
        id,
        dto,
      );
  }

  @Delete(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    USER_ROLES.ADMIN,
  )
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Delete a product (ADMIN only)',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiUnauthorizedResponse({
    description:
      'Login required',
  })
  @ApiForbiddenResponse({
    description:
      'ADMIN role required',
  })
  remove(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.productsService
      .remove(id);
  }
}
