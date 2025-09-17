import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { customAlphabet } from 'nanoid';
import { JwtPayload } from 'src/common/@types';
import { getAuthConfig } from 'src/common/config';
import { BcryptService, SendMailService } from 'src/common/services';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities';
import { LoginDto, LoginResponseDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly bcryptService: BcryptService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly sendMailService: SendMailService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.userRepository.findOneBy({
      email,
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await this.bcryptService.comparePasswords(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const authConfig = getAuthConfig(this.configService);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: authConfig.jwtSecret,
      expiresIn: authConfig.jwtExpiration,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: authConfig.jwtRefreshSecret,
      expiresIn: authConfig.jwtRefreshExpiration,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async refreshTokens(
    userId: string,
    email: string,
  ): Promise<LoginResponseDto> {
    const authConfig = getAuthConfig(this.configService);
    const payload = { sub: userId, email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: authConfig.jwtSecret,
      expiresIn: authConfig.jwtExpiration,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: authConfig.jwtRefreshSecret,
      expiresIn: authConfig.jwtRefreshExpiration,
    });

    return {
      accessToken,
      refreshToken,
      user: { id: userId, email },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOneBy({
      email,
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    const nanoidNumbers = customAlphabet('0123456789', 6);

    const code = nanoidNumbers();

    await this.redisClient.set(code, JSON.stringify(user.id), 'EX', 60 * 5);

    await this.sendMailService.send({
      to: user.email,
      subject: 'Redefinição de Senha',
      template: 'reset-password.pug',
      parametros: {
        name: user.name,
        code,
      },
    });
  }

  async resetPassword(code: string, newPassword: string) {
    const userId = await this.redisClient.get(code);
    if (!userId) {
      throw new BadRequestException('Código inválido ou expirado');
    }

    const user = await this.userRepository.findOneBy({
      id: JSON.parse(userId),
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const hashedPassword = await this.bcryptService.hashPassword(newPassword);

    user.password = hashedPassword;
    await this.userRepository.save(user);

    await this.redisClient.del(code);

    return { message: 'Senha redefinida com sucesso' };
  }
}
