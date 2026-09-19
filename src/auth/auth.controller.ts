import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto.js';
import { NewPasswordDto } from './dto/newPassword-auth.dto.js';
import { LoginAuthDto } from './dto/login-auth.dto.js';
import { Public } from './decorators/public.decorator.js';
import { Roles } from './decorators/roles.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public() // Se libera a este endpoint de auth y  resctriciones de roles
  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Roles('ADMIN')
  @Post('register')
  async register(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.authService.register(createUsuarioDto);
  }

  // Trae los datos del usuario logeado
  @Patch('new-password')
  async newPassword(
    @Req() req: Request & { user: unknown },
    @Body() newPasswordDto: NewPasswordDto,
  ) {
    return this.authService.newPassword(
      (req.user as CreateUsuarioDto).email,
      newPasswordDto,
    );
  }
}
