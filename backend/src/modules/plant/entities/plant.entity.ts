import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('plants')
export class PlantEntity {
  @ApiProperty({
    description: 'Identificador único da planta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Samambaia', description: 'Nome da planta' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Interiores', description: 'Localização da planta' })
  @Column()
  location: string;

  @ApiProperty({ example: '2025-09-19', description: 'Data de plantio' })
  @Column()
  date: string;

  @ApiPropertyOptional({
    example: 'https://via.placeholder.com/60',
    description: 'Imagem da planta (opcional)',
  })
  @Column({ nullable: true })
  image?: string;

  @ManyToOne(() => UserEntity, (user) => user.plants)
  user: UserEntity;
}
