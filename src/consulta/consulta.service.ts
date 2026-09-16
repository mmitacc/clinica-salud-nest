import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConsultaDto } from './dto/create-consulta.dto.js';
import { UpdateConsultaDto } from './dto/update-consulta.dto.js';
import { PrismaClient } from '../prisma/generated-client/client.js';
import { EstadoCita } from '../prisma/generated-client/client.js';

@Injectable()
export class ConsultaService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(createConsultaDto: CreateConsultaDto) {
    return await this.prisma.consulta.create({
      data: createConsultaDto,
      omit: { deleted: true },
    });
  }

  async findAll() {
    return await this.prisma.consulta.findMany({
      where: { deleted: false },
      omit: { deleted: true },
      orderBy: { id: 'asc' },
    });
  }

  async findRentabilidadArea() {
    const especialidades = await this.prisma.especialidad.findMany({
      select: {
        id: true,
        tipo: true,
        usuarios: {
          select: {
            _count: {
              select: {
                consultas: {
                  where: { estado: 'PROGRAMADA', deleted: false },
                },
              },
            },
          },
        },
      },
    });
    return especialidades
      .map((esp) => {
        const totalConsultas = esp.usuarios.reduce(
          (sum, med) => sum + med._count.consultas,
          0,
        );
        return {
          id: esp.id,
          tipo: esp.tipo,
          total_programadas: totalConsultas,
        };
      })
      .filter((esp) => esp.total_programadas > 0);
  }

  async findOne(id: number) {
    const options = {
      where: { id, deleted: false },
      select: {
        id: true,
        estado: true,
        citadate: true,
        costo: true,
        registerdate: true,
        paciente: {
          select: { id: true, nombres: true, apellidos: true, telefono: true },
        },
        usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            especialidad: { select: { tipo: true } },
          },
        },
      },
    };
    return await this.prisma.consulta.findFirst(options);
  }

  async findCorteOperativo(fechaInicio?: Date, fechaFin?: Date) {
    const whereClause = {
      deleted: false,
      estado: { not: 'PROGRAMADA' },
    };
    if (fechaInicio && fechaFin) {
      (whereClause as any).registerdate = {
        gte: fechaInicio,
        lte: fechaFin,
      };
    }
    const corteOperativo = await this.prisma.consulta.groupBy({
      by: ['estado'],
      _count: {
        estado: true,
      },
      where: whereClause as any,
    });
    return corteOperativo.map((est) => {
      return {
        estado: est.estado,
        count: est._count.estado,
      };
    });
  }

  async update(id: number, updateConsultaDto: UpdateConsultaDto) {
    const consulta = await this.prisma.consulta.findFirst({
      where: { id, deleted: false },
    });
    if (!consulta)
      throw new NotFoundException(`El ID:${id}, no fue encontrado.`);
    return await this.prisma.consulta.update({
      where: { id, deleted: false },
      data: updateConsultaDto,
      omit: { deleted: true },
    });
  }

  async updateEstado(id: number, estado: EstadoCita) {
    const consulta = await this.prisma.consulta.findFirst({
      where: { id, deleted: false },
    });
    if (!consulta)
      throw new NotFoundException(`El ID:${id}, no fue encontrado.`);
    return await this.prisma.consulta.update({
      where: { id, deleted: false },
      data: { estado },
      omit: { deleted: true },
    });
  }

  async removeSoft(id: number) {
    const consulta = await this.prisma.consulta.findFirst({
      where: { id, deleted: false },
    });
    if (!consulta)
      throw new NotFoundException(`El ID:${id}, no fue encontrado.`);
    return await this.prisma.consulta.update({
      where: { id, deleted: false },
      data: { deleted: true },
      omit: { deleted: true },
    });
  }

  async remove(id: number) {
    const consulta = await this.prisma.consulta.findFirst({
      where: { id, deleted: false },
    });
    if (!consulta)
      throw new NotFoundException(`El ID:${id}, no fue encontrado.`);
    return await this.prisma.consulta.delete({ where: { id } });
  }
}
