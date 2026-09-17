import { Injectable, NotFoundException } from '@nestjs/common';
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
      where: { deleted: false },
      omit: { deleted: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const paciente = await this.prisma.paciente.findFirst({
      where: { id, deleted: false },
      include: {
        consultas: { omit: { deleted: true } },
      },
      omit: { deleted: true },
    });
    if (!paciente)
      throw new NotFoundException(`El ID:${id}, no fue encontrado.`);
    return paciente;
  }

  async update(id: number, updatePacienteDto: UpdatePacienteDto) {
    const paciente = await this.prisma.paciente.findFirst({
      where: { id, deleted: false },
    });
    if (!paciente)
      throw new NotFoundException(`El ID:${id}, no fue encontrado.`);
    return await this.prisma.paciente.update({
      where: { id, deleted: false },
      data: updatePacienteDto,
      omit: { deleted: true },
    });
  }

  async removeSoft(id: number) {
    const paciente = await this.prisma.paciente.findFirst({
      where: { id, deleted: false },
    });
    if (!paciente)
      throw new NotFoundException(`El ID:${id}, no fue encontrado.`);
    return await this.prisma.paciente.update({
      where: { id, deleted: false },
      data: { deleted: true },
      omit: { deleted: true },
    });
  }
}
