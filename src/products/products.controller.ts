import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dtos/create-product.dto';

import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('Produtos')
@Controller('produtos')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo produto' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso.', type: Product })
  create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar produtos, opcionalmente filtrando por faixa de preço' })
  @ApiQuery({ name: 'preco_min', required: false, description: 'Preço mínimo para filtro', type: Number })
  @ApiQuery({ name: 'preco_max', required: false, description: 'Preço máximo para filtro', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de produtos filtrada.', type: [Product] })
  findAll(
    @Query('preco_min') precoMin?: string,
    @Query('preco_max') precoMax?: string,
  ): Promise<Product[]> {
    const min = precoMin ? parseFloat(precoMin) : undefined;
    const max = precoMax ? parseFloat(precoMax) : undefined;
    return this.productsService.findAll(min, max);
  }
}
