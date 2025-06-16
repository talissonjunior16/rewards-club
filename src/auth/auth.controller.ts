import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginClientDto } from './dtos/login-client.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('autenticacao')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/cliente')
  @ApiOperation({ summary: 'Login do cliente' })
  @ApiBody({ type: LoginClientDto })
  @ApiResponse({ status: 201, description: 'Cliente autenticado com sucesso' })
  @ApiResponse({ status: 401, description: 'Email ou senha inválidos' })
  async login(@Body() loginDto: LoginClientDto) {
    const client = await this.authService.validateClient(loginDto.email, loginDto.password);
    if (!client) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }
    return this.authService.login(client);
  }
}