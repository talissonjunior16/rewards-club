import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

import { ProductsController } from '../src/products/products.controller';
import { ProductsService } from '../src/products/products.service';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;

  // Mock do serviço
  let productsService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],      // só o controller
      providers: [
        {
          provide: ProductsService,           // mock do serviço
          useValue: productsService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /produtos', () => {
    it('should create a product', async () => {
      const productMock = { id: 1, name: 'Produto Teste', price: 100 };
      productsService.create.mockResolvedValue(productMock);

      const dto = { 
        name: 'Produto Teste', 
        description: 'Descrição do produto teste',
        price: 100 
      };

      const response = await request(app.getHttpServer())
        .post('/produtos')
        .send(dto)
        .expect(201);

      expect(response.body).toEqual(productMock);
      expect(productsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('GET /produtos', () => {
    it('should list products filtered by price range', async () => {
      const productsMock = [{ id: 1, price: 50 }, { id: 2, price: 90 }];
      productsService.findAll.mockResolvedValue(productsMock);

      const response = await request(app.getHttpServer())
        .get('/produtos')
        .query({ preco_min: '10', preco_max: '100' })
        .expect(200);

      expect(response.body).toEqual(productsMock);
      expect(productsService.findAll).toHaveBeenCalledWith(10, 100);
    });

    it('should list all products if no filters', async () => {
      const productsMock = [{ id: 1 }, { id: 2 }];
      productsService.findAll.mockResolvedValue(productsMock);

      const response = await request(app.getHttpServer())
        .get('/produtos')
        .expect(200);

      expect(response.body).toEqual(productsMock);
      expect(productsService.findAll).toHaveBeenCalledWith(undefined, undefined);
    });
  });
});
