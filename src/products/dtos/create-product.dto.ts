import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Notebook', description: 'Nome do produto' })
  @IsString({ message: 'O nome deve ser um texto' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio' })
  name: string;

  @ApiProperty({ example: 'Notebook com 16GB RAM e SSD 512GB', description: 'Descrição do produto' })
  @IsString({ message: 'A descrição deve ser um texto' })
  description: string;

  @ApiProperty({ example: 3500.50, description: 'Preço do produto' })
  @IsNumber({}, { message: 'O preço deve ser um número' })
  @Min(10, { message: 'O preço deve ser no mínimo 10' })
  price: number;
}