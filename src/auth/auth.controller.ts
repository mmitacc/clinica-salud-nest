import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto.js';
import { UpdatePerfilDto } from './dto/login-auth.dto.js';
import { NewPasswordDto } from './dto/newPassword-auth.dto.js';
import { LoginAuthDto } from './dto/login-auth.dto.js';
import { Public } from './decorators/public.decorator.js';
import { Roles } from './decorators/roles.decorator.js';
import { User } from './decorators/user.decarator.js';
import { ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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
    @User() user: any, // Uso de @User, para traer solo 'email' del usuario logeado
    @Body() newPasswordDto: NewPasswordDto,
  ) {
    return this.authService.newPassword(user.email, newPasswordDto);
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

  // NUEVO ENDPOINT PARA ACTUALIZAR EL PERFIL CLÍNICO con CLOUDINARY
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data') // Le indica a Swagger que este endpoint recibe archivos físicos
  @ApiOperation({
    summary:
      'Actualiza los datos personales y la foto de perfil del usuario logueado',
  })
  @Put('perfil')
  @UseInterceptors(FileInterceptor('foto')) // Intercepta el campo 'foto' del FormData en memoria RAM
  async actualizarPerfil(
    @User() user: any, // Traemos el objeto del usuario logueado actual
    @Body() datosDto: UpdatePerfilDto,
    @UploadedFile() file?: any, // Express.Multer.File o 'any' por tu configuración ESM
  ) {
    let urlNuevaFoto: string | undefined = undefined;

    if (file) {
      // 1. ELIMINACIÓN DE LA FOTO ANTERIOR: Si el usuario ya tenía foto de Cloudinary, la borramos
      if (user.foto) {
        await this.cloudinaryService.eliminarImagen(user.foto);
      }

      // 2. SUBIDA DE LA NUEVA FOTO: Subimos el archivo a Cloudinary
      const resultado = await this.cloudinaryService.subirImagen(file);
      urlNuevaFoto = resultado.secure_url;
    }

    // 3. ACTUALIZACIÓN EN DB: Enviamos los campos de texto junto a la URL procesada al AuthService
    return this.authService.actualizarPerfil(user.id, {
      username: datosDto.username,
      telefono: datosDto.telefono,
      foto: urlNuevaFoto,
    });
  }
}
