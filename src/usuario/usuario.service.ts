import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    return await this.prisma.usuario.create({
      data: createUsuarioDto,
      omit: { deleted: true, password: true },
    });
  }

  async findAll() {
    return await this.prisma.usuario.findMany({
      where: { deleted: false },
      omit: { deleted: true, password: true, id_especialidad: true },
      include: { especialidad: { select: { tipo: true } } },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { id, deleted: false },
      omit: { deleted: true, id_especialidad: true, password: true },
      include: { especialidad: { omit: { deleted: true } } },
    });
    if (!usuario)
      throw new NotFoundException(`El ID:${id}, no fue encontrado.`);
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { id, deleted: false },
    });
    if (!usuario)
      throw new NotFoundException(`El ID:${id}, no fue encontrado.`);
    return await this.prisma.usuario.update({
      where: { id, deleted: false },
      data: updateUsuarioDto,
      omit: { deleted: true, password: true },
    });
  }

  async removeSoft(id: number) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { id, deleted: false },
    });
    if (!usuario)
      throw new NotFoundException(`El ID:${id}, no fue encontrado.`);
    return await this.prisma.usuario.update({
      where: { id, deleted: false },
      data: { deleted: true },
      omit: { deleted: true, password: true },
    });
  }
}
