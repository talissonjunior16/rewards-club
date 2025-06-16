import { Controller, Get, Post, Body, Query, Request, UseGuards } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dtos/create-purchase.dto';
import { ApiTags, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Compras')
@Controller('compras')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  
  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreatePurchaseDto })
  @ApiResponse({ status: 201, description: 'Compra registrada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async create(@Request() req, @Body() createPurchaseDto: CreatePurchaseDto) {
    const clientId = req.user.id;
    return this.purchasesService.createPurchase(clientId, createPurchaseDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de compras.' })
  async findAll(@Query('cliente_id') clienteId?: string) {
    if (clienteId) {
      return this.purchasesService.findByClientId(+clienteId);
    }
    return this.purchasesService.findAll();
  }
}
