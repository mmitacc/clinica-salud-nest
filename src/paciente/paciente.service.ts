import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto.js';
import { UpdatePacienteDto } from './dto/update-paciente.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PacienteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPacienteDto: CreatePacienteDto) {
    return await this.prisma.check.paciente.create({
      data: createPacienteDto,
    });
  }

  async findAll() {
    return await this.prisma.check.paciente.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    return await this.prisma.check.paciente.findFirst({
      where: { id },
    });
  }

  async update(id: number, updatePacienteDto: UpdatePacienteDto) {
    return await this.prisma.check.paciente.update({
      where: { id },
      data: updatePacienteDto,
    });
  }

  async removeSoft(id: number) {
    return await this.prisma.check.paciente.update({
      where: { id },
      data: { deleted: true, deletedate: new Date() },
    });
  }
}
