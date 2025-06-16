import { Injectable } from '@nestjs/common';
import { ClientsService } from '../clients/clients.service';
import { JwtService } from '@nestjs/jwt';
import { Client } from '../clients/entities/client.entity';
import { Utils } from '../common/utils/password.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly jwtService: JwtService,
  ) {}

  async validateClient(email: string, password: string): Promise<Client | null> {
    const client = await this.clientsService.findByEmail(email);
    if (!client) return null;

    const isPasswordValid = await Utils.comparePassword(password, client.password);
    return isPasswordValid ? client : null;
  }

  async validateClientById(id: number) {
    return this.clientsService.validateClientById(id);
  }

  async login(client: Client) {
    const payload = { sub: client.id, email: client.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
