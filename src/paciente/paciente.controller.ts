import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PacienteService } from './paciente.service.js';
import { CreatePacienteDto } from './dto/create-paciente.dto.js';
import { UpdatePacienteDto } from './dto/update-paciente.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('paciente')
@ApiBearerAuth()
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}
  @Roles('RECEPCIONISTA')
  @ApiOperation({ summary: 'Registra un nuevo Paciente' })
  @Post()
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacienteService.create(createPacienteDto);
  }

  @ApiOperation({ summary: 'Lista todos los Pacientes' })
  @Get()
  findAll() {
    return this.pacienteService.findAll();
  }

  @ApiOperation({ summary: 'Muestra un Paciente identificado por su ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pacienteService.findOne(+id);
  }

  @Roles('RECEPCIONISTA')
  @ApiOperation({
    summary: 'Actualiza algún campo de un Paciente identificado por su ID',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePacienteDto: UpdatePacienteDto,
  ) {
    return this.pacienteService.update(+id, updatePacienteDto);
  }

  @Roles('ADMIN', 'GERENCIA')
  @ApiOperation({ summary: 'Elimina un Paciente identificado por su ID' })
  @Delete(':id')
  removeSoft(@Param('id') id: string) {
    return this.pacienteService.removeSoft(+id);
  }
}
