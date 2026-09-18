import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    return await this.prisma.check.usuario.create({
      data: createUsuarioDto,
      omit: { password: true },
    });
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

  async removeSoft(id: number) {
    return await this.prisma.check.usuario.update({
      where: { id },
      data: { deleted: true, deletedate: new Date() },
      omit: { password: true },
    });
  }
}
