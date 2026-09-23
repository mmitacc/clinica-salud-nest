import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto.js';
import { NewPasswordDto } from './dto/newPassword-auth.dto.js';
import { LoginAuthDto } from './dto/login-auth.dto.js';
import { Public } from './decorators/public.decorator.js';
import { Roles } from './decorators/roles.decorator.js';
import { User } from './decorators/user.decarator.js';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public() // Se libera a este endpoint de auth y  resctriciones de roles
  @ApiOperation({
    summary: '(PUBLICO) Solo para loguearse con email y password',
  })
  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registra un nuevo Usuario' })
  @Roles('ADMIN')
  @Post('register')
  async register(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.authService.register(createUsuarioDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cambia el password del Usuario actualmente logueado',
  })
  @Patch('new-password')
  async newPassword(
    @User('email') email: string, // Uso de @User, para traer solo 'email' del usuario logeado
    @Body() newPasswordDto: NewPasswordDto,
  ) {
    return this.authService.newPassword(email, newPasswordDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Muestra los datos del Usuario actualmente logueado',
  })
  @Get('profile')
  async profile(@User() user: any) {
    // Uso de @User, para traer toda la data del usuario logeado
    return user;
  }
}
