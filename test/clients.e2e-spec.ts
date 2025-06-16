import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

import { ClientsController } from '../src/clients/clients.controller';
import { ClientsService } from '../src/clients/clients.service';

describe('ClientsController (e2e)', () => {
  let app: INestApplication;

  let clientsService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: clientsService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /clientes', () => {
    it('should create a client', async () => {
      const clientMock = { id: 1, name: 'Cliente Teste', email: 'teste@exemplo.com' };
      clientsService.create.mockResolvedValue(clientMock);

      const dto = {
        name: 'Cliente Teste',
        email: 'teste@exemplo.com',
        password: 'senha123', 
      };

      const response = await request(app.getHttpServer())
        .post('/clientes')
        .send(dto)
        .expect(201);

      expect(response.body).toEqual(clientMock);
      expect(clientsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('GET /clientes', () => {
    it('should list all clients', async () => {
      const clientsMock = [
        { id: 1, name: 'Cliente 1', email: 'c1@exemplo.com' },
        { id: 2, name: 'Cliente 2', email: 'c2@exemplo.com' },
      ];
      clientsService.findAll.mockResolvedValue(clientsMock);

      const response = await request(app.getHttpServer())
        .get('/clientes')
        .expect(200);

      expect(response.body).toEqual(clientsMock);
      expect(clientsService.findAll).toHaveBeenCalled();
    });
  });
});
