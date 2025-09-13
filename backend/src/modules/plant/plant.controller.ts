import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PlantService } from './plant.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards';
import type { RequestWithUser } from 'src/common/interfaces';
import { PlantEntity } from './entities';

@ApiTags('Plant')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('plant')
export class PlantController {
  constructor(private readonly plantService: PlantService) {}
  @Post()
  @ApiOperation({ summary: 'Cria uma nova planta' })
  @ApiResponse({
    status: 201,
    description: 'A planta foi criada com sucesso.',
    type: PlantEntity,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  create(@Req() req: RequestWithUser, @Body() createPlantDto: CreatePlantDto) {
    return this.plantService.create(req.user.userId, createPlantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as plantas do usuário' })
  @ApiResponse({
    status: 200,
    description: 'A lista de plantas foi retornada com sucesso.',
    type: [PlantEntity],
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  findAll(@Req() req: RequestWithUser) {
    return this.plantService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma planta pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'A planta foi encontrada com sucesso.',
    type: PlantEntity,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Planta não encontrada.' })
  findOne(@Param('id') id: string) {
    return this.plantService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma planta' })
  @ApiResponse({
    status: 200,
    description: 'A planta foi atualizada com sucesso.',
    type: PlantEntity,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Planta não encontrada.' })
  update(@Param('id') id: string, @Body() updatePlantDto: UpdatePlantDto) {
    return this.plantService.update(id, updatePlantDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma planta' })
  @ApiResponse({
    status: 200,
    description: 'A planta foi removida com sucesso.',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Planta não encontrada.' })
  remove(@Param('id') id: string) {
    return this.plantService.remove(id);
  }
}
