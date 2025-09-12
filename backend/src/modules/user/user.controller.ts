import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'O usuário foi criado com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT ,
    description: 'Já existe um usuário com este e-mail.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Requisição inválida.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
