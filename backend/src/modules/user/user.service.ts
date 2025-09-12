import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities';
import { Repository } from 'typeorm';
import { BcryptService } from 'src/common/services';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly bcryptService: BcryptService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone } = createUserDto;

    const userExists = await this.userRepository.findOneBy({
      email,
    });

    if (userExists) {
      throw new ConflictException('Já existe um usuário com este e-mail.');
    }

    const hashedPassword = await this.bcryptService.hashPassword(password);

    const user = await this.userRepository.create({
    email,
    password: hashedPassword,
    name,
    phone
    });

    const { password: _, ...result } = user;
    return result;
  }
}
