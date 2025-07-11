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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePurchaseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePurchaseDto {
}
exports.CreatePurchaseDto = CreatePurchaseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID do produto a ser comprado', example: 1 }),
    (0, class_validator_1.IsNumber)({}, { message: 'O campo productId deve ser um número válido.' }),
    __metadata("design:type", Number)
], CreatePurchaseDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantidade do produto', example: 1, minimum: 1 }),
    (0, class_validator_1.IsNumber)({}, { message: 'O campo quantity deve ser um número válido.' }),
    (0, class_validator_1.Min)(1, { message: 'A quantidade mínima para compra é 1.' }),
    __metadata("design:type", Number)
], CreatePurchaseDto.prototype, "quantity", void 0);
//# sourceMappingURL=create-purchase.dto.js.map