import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dtos/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(dto);
    return this.productsRepository.save(product);
  }

  async findAll(preco_min?: number, preco_max?: number): Promise<Product[]> {
    if (preco_min != null && preco_max != null) {
      return this.productsRepository.find({
        where: { price: Between(preco_min, preco_max) },
      });
    }
    return this.productsRepository.find();
  }

}
