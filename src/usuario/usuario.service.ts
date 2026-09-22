import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { EspecialidadService } from '../especialidad/especialidad.service.js';
import bcrypt from 'bcryptjs';
import { NewPasswordDto } from '../auth/dto/newPassword-auth.dto.js';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly especialidadService: EspecialidadService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const { password, id_especialidad, ...restoDataUsuario } = createUsuarioDto;
    let especialidad = null;
    if (id_especialidad) {
      especialidad = await this.especialidadService.findOne(id_especialidad);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const usuario = await this.prisma.check.usuario.create({
      data: { password: hashedPassword, ...restoDataUsuario },
      omit: { password: true, id_especialidad: true },
    });
    return especialidad
      ? { usuario, especialidad: especialidad.tipo }
      : usuario;
  }

  async findByEmail(email: string) {
    return await this.prisma.check.usuario.findFirst({ where: { email } });
  }

  async findAll() {
    return await this.prisma.check.usuario.findMany({
      omit: { password: true, id_especialidad: true },
      include: { especialidad: { select: { tipo: true } } },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    return await this.prisma.check.usuario.findFirst({
      where: { id },
      omit: { id_especialidad: true, password: true },
      include: { especialidad: { select: { tipo: true } } },
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return await this.prisma.check.usuario.update({
      where: { id },
      data: updateUsuarioDto,
      omit: { password: true },
    });
  }

  async updatePassword(email: string, newPasswordDto: NewPasswordDto) {
    const { password } = newPasswordDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const usuario = await this.prisma.check.usuario.update({
      where: { email },
      data: { password: hashedPassword },
      omit: { password: true },
    });
    return {
      message: `Usuario: ${usuario.username}, el password fue actualizado correctamente`,
    };
  }

  async removeSoft(id: number) {
    return await this.prisma.check.usuario.update({
      where: { id },
      data: { deleted: true, deletedate: new Date() },
      omit: { password: true },
    });
  }
}
