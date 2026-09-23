import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EspecialidadService } from './especialidad.service.js';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto.js';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('especialidades')
@ApiBearerAuth()
export class EspecialidadController {
  constructor(private readonly especialidadService: EspecialidadService) {}

  @Roles('ADMIN', 'GERENCIA')
  @ApiOperation({ summary: 'Registra una nueva Especialidad' })
  @Post()
  create(@Body() createEspecialidadDto: CreateEspecialidadDto) {
    return this.especialidadService.create(createEspecialidadDto);
  }

  @ApiOperation({ summary: 'Lista todas las Especialidades' })
  @Get()
  findAll() {
    return this.especialidadService.findAll();
  }

  @ApiOperation({ summary: 'Muestra una Especialidad identificada por su ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.especialidadService.findOne(+id);
  }

  @Roles('ADMIN', 'GERENCIA')
  @ApiOperation({
    summary: 'Actualiza el tipo de una Especialidad identificada por su ID',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEspecialidadDto: UpdateEspecialidadDto,
  ) {
    return this.especialidadService.update(+id, updateEspecialidadDto);
  }

  @Roles('ADMIN', 'GERENCIA')
  @ApiOperation({ summary: 'Elimina una Especialidad identificada por su ID' })
  @Delete(':id')
  removeSoft(@Param('id') id: string) {
    return this.especialidadService.removeSoft(+id);
  }
}
