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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_client_dto_1 = require("./dtos/login-client.dto");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto) {
        const client = await this.authService.validateClient(loginDto.email, loginDto.password);
        if (!client) {
            throw new common_1.UnauthorizedException('Email ou senha inválidos');
        }
        return this.authService.login(client);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login/cliente'),
    (0, swagger_1.ApiOperation)({ summary: 'Login do cliente' }),
    (0, swagger_1.ApiBody)({ type: login_client_dto_1.LoginClientDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Cliente autenticado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Email ou senha inválidos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_client_dto_1.LoginClientDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Autenticação'),
    (0, common_1.Controller)('autenticacao'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map