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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const clients_service_1 = require("../clients/clients.service");
const jwt_1 = require("@nestjs/jwt");
const password_utils_1 = require("../common/utils/password.utils");
let AuthService = class AuthService {
    constructor(clientsService, jwtService) {
        this.clientsService = clientsService;
        this.jwtService = jwtService;
    }
    async validateClient(email, password) {
        const client = await this.clientsService.findByEmail(email);
        if (!client)
            return null;
        const isPasswordValid = await password_utils_1.Utils.comparePassword(password, client.password);
        return isPasswordValid ? client : null;
    }
    async validateClientById(id) {
        return this.clientsService.validateClientById(id);
    }
    async login(client) {
        const payload = { sub: client.id, email: client.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clients_service_1.ClientsService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map