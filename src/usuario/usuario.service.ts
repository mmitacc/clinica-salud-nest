import { Injectable, NotFoundException } from '@nestjs/common';
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
        // Si viene 'especialidadNombre', aplica el filtro; si no, no filtra nada por este campo
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

  async remove(id: number) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { id, deleted: false },
    });
    if (!usuario)
      throw new NotFoundException(`El ID:${id}, no fue encontrado.`);
    return await this.prisma.usuario.delete({
      where: { id },
    });
  }

  async findAgendaByDate(id: number, fechaInicio?: Date, fechaFin?: Date) {
    const options = {
      where: {
        id,
        deleted: false,
      },
      select: {
        nombres: true,
        apellidos: true,
        especialidad: { select: { tipo: true } },
        consultas: {
          select: {
            citadate: true,
            paciente: {
              select: {
                id: true,
                nombres: true,
                apellidos: true,
              },
            },
          },
          where: {},
        },
      },
    };
    if (fechaInicio && fechaFin && options.select?.consultas) {
      (options.select.consultas as any).where = {
        citadate: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      };
    }
    return await this.prisma.usuario.findFirst(options);
  }

  async findAllByIdEspecialidad(idEspecialidad: number) {
    return await this.prisma.usuario.findMany({
      where: { id_especialidad: idEspecialidad, deleted: false },
      select: { id: true, nombres: true, apellidos: true },
    });
  }
}
