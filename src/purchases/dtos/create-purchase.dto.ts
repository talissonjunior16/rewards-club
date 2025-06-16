import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class CreatePurchaseDto {
  @ApiProperty({ description: 'ID do produto a ser comprado', example: 1 })
  @IsNumber({}, { message: 'O campo productId deve ser um número válido.' })
  productId: number;

  @ApiProperty({ description: 'Quantidade do produto', example: 1, minimum: 1 })
  @IsNumber({}, { message: 'O campo quantity deve ser um número válido.' })
  @Min(1, { message: 'A quantidade mínima para compra é 1.' })
  quantity: number;
}