import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsuarioService } from '../usuario/usuario.service.js';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto.js';
import { LoginAuthDto } from './dto/login-auth.dto.js';
import { NewPasswordDto } from './dto/newPassword-auth.dto.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly configService: ConfigService,
  ) {}

  async register(createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  async login(loginAuthDto: LoginAuthDto) {
    const usuario = await this.usuarioService.findByEmail(loginAuthDto.email);
    if (!usuario) throw new UnauthorizedException('Credenciales invalidas');
    const isMatch = await bcrypt.compare(
      loginAuthDto.password,
      usuario.password,
    );
    if (!isMatch) throw new UnauthorizedException('Credenciales invalidas');
    const { id, username, email, role } = usuario;
    const token = jwt.sign(
      { id, username, email, role },
      this.configService.getOrThrow<string>('JWT_SECRET'),
      { expiresIn: '8h' },
    );
    return { token };
  }

  async newPassword(email: string, newPasswordDto: NewPasswordDto) {
    return this.usuarioService.updatePassword(email, newPasswordDto);
  }
}
