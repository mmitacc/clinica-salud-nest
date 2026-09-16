import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHistorialDto } from './dto/create-historial.dto.js';
import { UpdateHistorialDto } from './dto/update-historial.dto.js';
import { PrismaClient } from '../prisma/generated-client/client.js';

@Injectable()
export class HistorialService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(createHistorialDto: CreateHistorialDto) {
    return await this.prisma.historial.create({
      data: createHistorialDto,
      omit: { deleted: true },
    });
  }

  async findAll() {
    return await this.prisma.historial.findMany({
      where: { deleted: false },
      omit: { deleted: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const historial = await this.prisma.historial.findFirst({
      where: { id, deleted: false },
      omit: { deleted: true },
    });
    if (!historial)
      throw new NotFoundException(`El ID:${id}, no fue encontrado.`);
    return historial;
  }

  async update(id: number, updateHistorialDto: UpdateHistorialDto) {
    const historial = await this.prisma.historial.findFirst({
      where: { id, deleted: false },
    });
    if (!historial)
      throw new NotFoundException(`El ID:${id}, no fue encontrado.`);
    return await this.prisma.historial.update({
      where: { id, deleted: false },
      data: updateHistorialDto,
      omit: { deleted: true },
    });
  }

  async removeSoft(id: number) {
    const historial = await this.prisma.historial.findFirst({
      where: { id, deleted: false },
    });
    if (!historial)
      throw new NotFoundException(`El ID:${id}, no fue encontrado.`);
    return await this.prisma.historial.update({
      where: { id, deleted: false },
      data: { deleted: true },
      omit: { deleted: true },
    });
  }

  async remove(id: number) {
    const historial = await this.prisma.historial.findFirst({
      where: { id, deleted: false },
    });
    if (!historial)
      throw new NotFoundException(`El ID:${id}, no fue encontrado.`);
    return await this.prisma.historial.delete({ where: { id } });
  }
}
