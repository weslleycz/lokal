import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities';
import { Repository } from 'typeorm';
import { BcryptService } from 'src/common/services';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly bcryptService: BcryptService,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone } = createUserDto;

    const userExists = await this.userRepository.findOne({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException('Já existe um usuário com este e-mail.');
    }

    const hashedPassword = await this.bcryptService.hashPassword(password);

    const user = await this.userRepository.save({
      email,
      password: hashedPassword,
      name,
      phone,
    });

    const { password: _, ...result } = user;
    return result;
  }
}
