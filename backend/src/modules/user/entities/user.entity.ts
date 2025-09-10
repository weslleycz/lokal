import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @ApiProperty({
    description: 'Identificador único do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Email do usuário. Deve ser único e usado para login',
    example: 'fulano@email.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário. Deve ser armazenada criptografada',
    example: 'SenhaForte123!',
  })
  @Column()
  password: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Fulano de Tal',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Telefone ou WhatsApp',
    example: '+5511999999999',
  })
  @Column()
  phone: string;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2025-09-10T17:00:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Data de exclusão lógica (soft delete)',
    example: null,
    required: false,
  })
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
