import { Injectable } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto.js';
import { UpdatePacienteDto } from './dto/update-paciente.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PacienteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPacienteDto: CreatePacienteDto) {
    return await this.prisma.paciente.create({
      data: createPacienteDto,
      omit: { deleted: true },
    });
  }

  async findAll() {
    return await this.prisma.paciente.findMany({
      orderBy: { id: 'asc' },
      omit: { deleted: true },
      where: { deleted: false },
    });
  }

  async findOne(id: number) {
    return await this.prisma.paciente.findFirst({
      where: { id, deleted: false },
      include: {
        consultas: { omit: { deleted: true } },
      },
      omit: { deleted: true },
    });
  }

  async update(id: number, updatePacienteDto: UpdatePacienteDto) {
    return await this.prisma.paciente.update({
      where: { id },
      data: updatePacienteDto,
      omit: { deleted: true },
    });
  }

  async removeSoft(id: number) {
    return await this.prisma.paciente.update({
      where: { id },
      data: { deleted: true },
      omit: { deleted: true },
    });
  }

  async remove(id: number) {
    return await this.prisma.paciente.delete({
      where: { id },
    });
  }
}
