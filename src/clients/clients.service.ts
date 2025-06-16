import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { Utils } from '../common/utils/password.utils';
import { CreateClientDto } from './dtos/create-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Omit<Client, 'password'>> {
    const existing = await this.clientsRepository.findOne({
      where: { email: createClientDto.email },
    });

    if (existing) {
      throw new ConflictException('Email já está em uso.');
    }

    const hashed = await Utils.hashPassword(createClientDto.password);
    const client = this.clientsRepository.create({
      ...createClientDto,
      password: hashed,
    });

    const saved = await this.clientsRepository.save(client);
    const { password, ...result } = saved;
    return result;
  }

  async findAll(): Promise<Omit<Client, 'password'>[]> {
    const clients = await this.clientsRepository.find();
    return clients.map(({ password, ...rest }) => rest);
  }

  async findByEmail(email: string): Promise<Client | undefined> {
    return this.clientsRepository.findOne({ where: { email } });
  }

  async validateClientById(id: number) {
    return this.clientsRepository.findOne({ where: { id } });
  }
}
