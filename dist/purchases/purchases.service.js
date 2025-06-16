"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchasesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const purchase_entity_1 = require("./entities/purchase.entity");
const client_entity_1 = require("../clients/entities/client.entity");
const product_entity_1 = require("../products/entities/product.entity");
let PurchasesService = class PurchasesService {
    constructor(purchasesRepository, clientsRepository, productsRepository) {
        this.purchasesRepository = purchasesRepository;
        this.clientsRepository = clientsRepository;
        this.productsRepository = productsRepository;
    }
    async createPurchase(clientId, createPurchaseDto) {
        const client = await this.clientsRepository.findOne({ where: { id: clientId } });
        if (!client)
            throw new common_1.NotFoundException('Cliente não encontrado');
        const product = await this.productsRepository.findOne({ where: { id: createPurchaseDto.productId } });
        if (!product)
            throw new common_1.NotFoundException('Produto não encontrado');
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
    async findAll() {
        return this.purchasesRepository
            .createQueryBuilder('purchase')
            .leftJoinAndSelect('purchase.product', 'product')
            .leftJoin('purchase.client', 'client')
            .addSelect(['client.id', 'client.email', 'client.name'])
            .getMany();
    }
    async findByClientId(clientId) {
        return this.purchasesRepository
            .createQueryBuilder('purchase')
            .leftJoinAndSelect('purchase.product', 'product')
            .leftJoin('purchase.client', 'client')
            .addSelect(['client.id', 'client.email', 'client.name'])
            .where('client.id = :clientId', { clientId })
            .getMany();
    }
};
exports.PurchasesService = PurchasesService;
exports.PurchasesService = PurchasesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(purchase_entity_1.Purchase)),
    __param(1, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PurchasesService);
//# sourceMappingURL=purchases.service.js.map