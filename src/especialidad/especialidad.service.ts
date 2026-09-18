import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto.js';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class EspecialidadService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEspecialidadDto: CreateEspecialidadDto) {
    return await this.prisma.check.especialidad.create({
      data: createEspecialidadDto,
    });
  }

  async findAll() {
    return await this.prisma.check.especialidad.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    return await this.prisma.check.especialidad.findFirst({
      where: { id },
    });
  }

  async update(id: number, updateEspecialidadDto: UpdateEspecialidadDto) {
    return await this.prisma.check.especialidad.update({
      where: { id },
      data: updateEspecialidadDto,
    });
  }

  async removeSoft(id: number) {
    return await this.prisma.check.especialidad.update({
      where: { id },
      data: {
        deleted: true,
        deletedate: new Date(),
      },
    });
  }
}
