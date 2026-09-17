import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateConsultaDto } from './dto/create-consulta.dto.js';
import { UpdateConsultaDto } from './dto/update-consulta.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ConsultaService {
  constructor(private readonly prisma: PrismaService) {}

  // Función para formatear el campo "citadate" en: fecha y horario
  private formatearConsulta(consulta: any) {
    if (!consulta || !consulta.citadate) return consulta;
    const d = new Date(consulta.citadate);
    // Extraemos la fecha (AAAA-MM-DD)
    const anio = d.getUTCFullYear();
    const mes = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dia = String(d.getUTCDate()).padStart(2, '0');
    const fecha = `${anio}-${mes}-${dia}`;
    // Extraemos el horario (HH:MM)
    const horas = String(d.getUTCHours()).padStart(2, '0');
    const minutos = String(d.getUTCMinutes()).padStart(2, '0');
    const horario = `${horas}:${minutos}`;
    // Desestructuramos para remover el campo original 'datecita'
    const { citadate, ...restoDatosConsulta } = consulta;
    return {
      ...restoDatosConsulta,
      fecha, // "2026-03-16"
      horario, // "14:30"
    };
  }
  // **************************************************************

  async create(createConsultaDto: CreateConsultaDto) {
    const { fecha, horario, id_usuario, ...restoDatosConsulta } =
      createConsultaDto;
    // Formateamos de fecha y horario al campo "citadate"
    const citadate = new Date(`${fecha}T${horario}:00`);
    // *************************************************
    const medico = await this.prisma.usuario.findFirst({
      where: { id: id_usuario },
    });
    if (medico?.role !== 'MEDICO')
      throw new BadRequestException(
        `El id_usuario=${id_usuario}, no corresponde a un Médico.`,
      );
    const consultaCreate = await this.prisma.consulta.create({
      data: { ...restoDatosConsulta, id_usuario, citadate },
      omit: { deleted: true },
    });
    return this.formatearConsulta(consultaCreate);
  }

  async findAll() {
    const consultas = await this.prisma.consulta.findMany({
      where: { deleted: false },
      omit: { deleted: true },
      orderBy: { id: 'asc' },
    });
    return consultas.map((consulta) => this.formatearConsulta(consulta));
  }

  async findOne(id: number) {
    const consulta = await this.prisma.consulta.findFirst({
      where: { id, deleted: false },
      omit: { deleted: true },
    });
    if (!consulta)
      throw new NotFoundException(`El ID:${id}, no fue encontrado.`);
    return this.formatearConsulta(consulta);
  }

  async update(id: number, updateConsultaDto: UpdateConsultaDto) {
    const consulta = await this.prisma.consulta.findFirst({
      where: { id, deleted: false },
    });
    if (!consulta)
      throw new NotFoundException(`El ID:${id}, no fue encontrado.`);
    const consultaUpdate = await this.prisma.consulta.update({
      where: { id, deleted: false },
      data: updateConsultaDto,
      omit: { deleted: true },
    });
    return this.formatearConsulta(consultaUpdate);
  }

  async removeSoft(id: number) {
    const consulta = await this.prisma.consulta.findFirst({
      where: { id, deleted: false },
    });
    if (!consulta)
      throw new NotFoundException(`El ID:${id}, no fue encontrado.`);
    const consultaDelete = await this.prisma.consulta.update({
      where: { id, deleted: false },
      data: { deleted: true },
      omit: { deleted: true },
    });
    return this.formatearConsulta(consultaDelete);
  }
}
