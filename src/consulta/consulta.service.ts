import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateConsultaDto } from './dto/create-consulta.dto.js';
import { UpdateConsultaDto } from './dto/update-consulta.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PacienteService } from '../paciente/paciente.service.js';
import { UsuarioService } from '../usuario/usuario.service.js';
import { formatDateOut } from './helpers/format-date.helper.js';

@Injectable()
export class ConsultaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pacienteService: PacienteService,
    private readonly usuarioService: UsuarioService,
  ) {}

  async create(createConsultaDto: CreateConsultaDto) {
    const { fecha, horario, id_usuario, id_paciente, costo } =
      createConsultaDto;
    // Formateamos de fecha y horario al campo "citadate"
    const citadate = new Date(`${fecha}T${horario}:00`);
    const medico = await this.usuarioService.findOne(id_usuario);
    if (medico!.role !== 'MEDICO')
      throw new BadRequestException(
        `El usuario con id=${id_usuario}, no corresponde a un Médico.`,
      );
    const paciente = await this.pacienteService.findOne(id_paciente);
    if (!paciente)
      throw new NotFoundException(
        `El paciente con el id=${id_paciente}, no existe.`,
      );
    const consultaCreate = await this.prisma.check.consulta.create({
      data: { costo, id_usuario, id_paciente, citadate },
    });
    return formatDateOut(consultaCreate);
  }

  async findAll() {
    const consultas = await this.prisma.check.consulta.findMany({
      orderBy: { id: 'asc' },
    });
    return consultas.map((consulta) => formatDateOut(consulta));
  }

  async findOne(id: number) {
    const consulta = await this.prisma.check.consulta.findFirst({
      where: { id },
    });
    return formatDateOut(consulta);
  }

  async update(id: number, updateConsultaDto: UpdateConsultaDto) {
    const consultaUpdate = await this.prisma.check.consulta.update({
      where: { id },
      data: updateConsultaDto,
    });
    return formatDateOut(consultaUpdate);
  }

  async removeSoft(id: number) {
    const consultaDelete = await this.prisma.check.consulta.update({
      where: { id },
      data: { deleted: true, deletedate: new Date() },
    });
    return formatDateOut(consultaDelete);
  }
}
