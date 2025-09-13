import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePlantDto {
  @ApiProperty({
    description: 'Nome da planta',
    example: 'Hortaliça 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Localização da planta',
    example: 'Setor A - Estufa 3',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    description: 'Data da plantação',
    example: '2025-09-13',
  })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'URL da imagem da planta',
    example: 'https://meusite.com/imagem.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;
}
