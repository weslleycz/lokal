import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities';
import { Repository } from 'typeorm';
import { PlantEntity } from './entities';

@Injectable()
export class PlantService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PlantEntity)
    private readonly plantRepository: Repository<PlantEntity>,
  ) {}

  async create(userId: string, createPlantDto: CreatePlantDto): Promise<PlantEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const plant = this.plantRepository.create({
      ...createPlantDto,
      user,
    });

    return this.plantRepository.save(plant);
  }

async findAll(userId: string): Promise<PlantEntity[]> {
  return this.plantRepository.find({
    where: { user: { id: userId } },
    order: { name: 'ASC' },
  });
}

  async findOne(id: string): Promise<PlantEntity> {
    const plant = await this.plantRepository.findOne({
      where: { id },
    });
    if (!plant) {
      throw new NotFoundException(`Plant with id ${id} not found`);
    }
    return plant;
  }

  async update(id: string, updatePlantDto: UpdatePlantDto): Promise<PlantEntity> {
    const plant = await this.findOne(id);
    Object.assign(plant, updatePlantDto);
    return this.plantRepository.save(plant);
  }

  async remove(id: string): Promise<void> {
    const plant = await this.findOne(id);
    await this.plantRepository.remove(plant);
  }
}
