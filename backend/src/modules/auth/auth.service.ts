import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities';
import { getAuthConfig } from 'src/common/config';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BcryptService } from 'src/common/services';
import { LoginDto, LoginResponseDto } from './dto';
import { JwtPayload } from 'src/common/@types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly bcryptService: BcryptService,
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
}
