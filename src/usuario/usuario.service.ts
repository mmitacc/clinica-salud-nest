import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUsuarioDto: CreateUsuarioDto) {
    const { id_especialidad, hashedPassword, ...otros_datos } =
      createUsuarioDto;
    return await this.prisma.usuario.create({
      data: {
        ...otros_datos,
        password: hashedPassword,
        ...(id_especialidad && {
          especialidad: { connect: { id: id_especialidad } },
        }),
      },
      omit: { deleted: true, password: true },
    });
  }

  async findAllMedico(especialidadNombre?: string) {
    return await this.prisma.usuario.findMany({
      where: {
        deleted: false,
        role: 'MEDICO',
        // Si viene el nombre, aplica el filtro; si no, no filtra nada por este campo
        ...(especialidadNombre && {
          especialidad: {
            tipo: { contains: especialidadNombre, mode: 'insensitive' },
          },
        }),
      },
      omit: { deleted: true, id_especialidad: true, password: true },
      include: { especialidad: { omit: { deleted: true } } },
      orderBy: { id: 'asc' },
    });
  }

  async findAll() {
    return await this.prisma.usuario.findMany({
      omit: { deleted: true, password: true, id_especialidad: true },
      include: { especialidad: { select: { tipo: true } } },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    return await this.prisma.usuario.findFirst({
      where: { id, deleted: false },
      omit: { deleted: true, id_especialidad: true, password: true },
      include: { especialidad: { omit: { deleted: true } } },
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return await this.prisma.usuario.update({
      where: { id },
      data: updateUsuarioDto,
      omit: { deleted: true, password: true },
    });
  }

  async removeSoft(id: number) {
    return await this.prisma.usuario.update({
      where: { id },
      data: { deleted: true },
      omit: { deleted: true, password: true },
    });
  }

  async remove(id: number) {
    return await this.prisma.usuario.delete({
      where: { id },
    });
  }
}
