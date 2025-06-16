import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { Client } from '../clients/entities/client.entity';
import { Product } from '../products/entities/product.entity';
import { CreatePurchaseDto } from './dtos/create-purchase.dto';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private purchasesRepository: Repository<Purchase>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async createPurchase(clientId: number, createPurchaseDto: CreatePurchaseDto): Promise<Purchase> {
    const client = await this.clientsRepository.findOne({ where: { id: clientId } });
    if (!client) throw new NotFoundException('Cliente não encontrado');

    const product = await this.productsRepository.findOne({ where: { id: createPurchaseDto.productId } });
    if (!product) throw new NotFoundException('Produto não encontrado');

    const totalPrice = Number(product.price) * createPurchaseDto.quantity;

    const purchase = this.purchasesRepository.create({
      client,
      product,
      quantity: createPurchaseDto.quantity,
      totalPrice,
    });

    const savedPurchase = await this.purchasesRepository.save(purchase);

    return this.purchasesRepository
      .createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.product', 'product')
      .leftJoin('purchase.client', 'client')
      .addSelect(['client.id', 'client.email', 'client.name'])
      .where('purchase.id = :id', { id: savedPurchase.id })
      .getOne();
  }

  async findAll(): Promise<Purchase[]> {
    return this.purchasesRepository
      .createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.product', 'product')
      .leftJoin('purchase.client', 'client')
      .addSelect(['client.id', 'client.email', 'client.name'])
      .getMany();
  }

  async findByClientId(clientId: number): Promise<Purchase[]> {
    return this.purchasesRepository
      .createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.product', 'product')
      .leftJoin('purchase.client', 'client')
      .addSelect(['client.id', 'client.email', 'client.name'])
      .where('client.id = :clientId', { clientId })
      .getMany();
  }
}
