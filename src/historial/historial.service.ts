import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHistorialDto } from './dto/create-historial.dto.js';
import { UpdateHistorialDto } from './dto/update-historial.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class HistorialService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createHistorialDto: CreateHistorialDto) {
    return await this.prisma.check.historial.create({
      data: createHistorialDto,
    });
  }

  async findAll() {
    return await this.prisma.check.historial.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    return await this.prisma.check.historial.findFirst({
      where: { id },
    });
  }

  async update(id: number, updateHistorialDto: UpdateHistorialDto) {
    return await this.prisma.check.historial.update({
      where: { id },
      data: updateHistorialDto,
    });
  }

  async removeSoft(id: number) {
    return await this.prisma.check.historial.update({
      where: { id },
      data: { deleted: true, deletedate: new Date() },
    });
  }
}
