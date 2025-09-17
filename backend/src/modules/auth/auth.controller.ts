import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  LoginDto,
  LoginResponseDto,
  ResetPasswordDto,
} from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtRefreshAuthGuard } from 'src/common/guards';
import type { RequestWithUser } from 'src/common/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'Realiza login do usuário e retorna tokens' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Login realizado com sucesso',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciais inválidas',
  })
  async login(@Body() data: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(data);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  @ApiOperation({
    summary: 'Renova tokens usando refresh token',
    description:
      'É necessário enviar o refresh token no header Authorization no formato: Bearer <refreshToken>',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tokens renovados com sucesso',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Refresh token inválido',
  })
  async refresh(@Req() req: RequestWithUser): Promise<LoginResponseDto> {
    return this.authService.refreshTokens(req.user.userId, req.user.email);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Realiza o processo de esqueci minha senha' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Processo concluído com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado',
  })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Código enviado com sucesso',
      data: await this.authService.forgotPassword(dto.email),
    };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Redefine a senha do usuário usando código' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Senha redefinida com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Código inválido ou expirado',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado',
  })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.code, dto.newPassword);
    return {
      statusCode: HttpStatus.OK,
      message: 'Senha redefinida com sucesso',
    };
  }
}
