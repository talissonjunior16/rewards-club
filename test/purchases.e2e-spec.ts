import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, ExecutionContext } from '@nestjs/common';
import request from 'supertest';

import { PurchasesController } from '../src/purchases/purchases.controller';
import { PurchasesService } from '../src/purchases/purchases.service';

import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';

// Mock do guard para liberar acesso no teste
class JwtAuthGuardMock {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    req.user = { id: 1 };
    return true;
  }
}

describe('PurchasesController (e2e)', () => {
  let app: INestApplication;

  let purchasesService = {
    createPurchase: jest.fn(),
    findByClientId: jest.fn(),
    findAll: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PurchasesController],
      providers: [
        {
          provide: PurchasesService,
          useValue: purchasesService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useClass(JwtAuthGuardMock)
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /compras', () => {
    it('should create a purchase', async () => {
      const purchaseMock = { id: 1, clientId: 1, productId: 5, quantity: 3 };
      purchasesService.createPurchase.mockResolvedValue(purchaseMock);

      const dto = {
        productId: 5,
        quantity: 3,
      };

      const response = await request(app.getHttpServer())
        .post('/compras')
        .send(dto)
        .expect(201);

      expect(response.body).toEqual(purchaseMock);
      expect(purchasesService.createPurchase).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('GET /compras', () => {
    it('should list purchases filtered by cliente_id', async () => {
      const purchasesMock = [
        { id: 1, clientId: 1, productId: 5, quantity: 2 },
        { id: 2, clientId: 1, productId: 3, quantity: 1 },
      ];
      purchasesService.findByClientId.mockResolvedValue(purchasesMock);

      const response = await request(app.getHttpServer())
        .get('/compras')
        .query({ cliente_id: '1' })
        .expect(200);

      expect(response.body).toEqual(purchasesMock);
      expect(purchasesService.findByClientId).toHaveBeenCalledWith(1);
    });

    it('should list all purchases if no cliente_id filter', async () => {
      const purchasesMock = [
        { id: 1, clientId: 1, productId: 5, quantity: 2 },
        { id: 2, clientId: 2, productId: 3, quantity: 1 },
      ];
      purchasesService.findAll.mockResolvedValue(purchasesMock);

      const response = await request(app.getHttpServer())
        .get('/compras')
        .expect(200);

      expect(response.body).toEqual(purchasesMock);
      expect(purchasesService.findAll).toHaveBeenCalled();
    });
  });
});
