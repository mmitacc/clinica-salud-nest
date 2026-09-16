import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto.js';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class EspecialidadService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEspecialidadDto: CreateEspecialidadDto) {
    return await this.prisma.especialidad.create({
      data: createEspecialidadDto,
      omit: { deleted: true },
    });
  }

  async findAll() {
    return await this.prisma.especialidad.findMany({
      where: { deleted: false },
      omit: { deleted: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const especialidad = await this.prisma.especialidad.findFirst({
      where: { id, deleted: false },
      omit: { deleted: true },
    });
    if (!especialidad)
      throw new NotFoundException(`El ID:${id}, no fue encontrado.`);
    return especialidad;
  }

  async update(id: number, updateEspecialidadDto: UpdateEspecialidadDto) {
    const especialidad = await this.prisma.especialidad.findFirst({
      where: { id, deleted: false },
    });
    if (!especialidad)
      throw new NotFoundException(`El ID:${id}, no fue encontrado.`);
    return await this.prisma.especialidad.update({
      where: { id, deleted: false },
      data: updateEspecialidadDto,
      omit: { deleted: true },
    });
  }

  async removeSoft(id: number) {
    const especialidad = await this.prisma.especialidad.findFirst({
      where: { id, deleted: false },
    });
    if (!especialidad)
      throw new NotFoundException(`El ID:${id}, no fue encontrado.`);
    return await this.prisma.especialidad.update({
      where: { id, deleted: false },
      data: {
        deleted: true,
      },
      omit: { deleted: true },
    });
  }

  async remove(id: number) {
    const especialidad = await this.prisma.especialidad.findFirst({
      where: { id, deleted: false },
    });
    if (!especialidad)
      throw new NotFoundException(`El ID:${id}, no fue encontrado.`);
    return this.prisma.especialidad.delete({ where: { id } });
  }
}
