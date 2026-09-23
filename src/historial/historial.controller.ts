import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HistorialService } from './historial.service.js';
import { CreateHistorialDto } from './dto/create-historial.dto.js';
import { UpdateHistorialDto } from './dto/update-historial.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('historial')
@ApiBearerAuth()
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  @Roles('MEDICO')
  @ApiOperation({ summary: 'Registra un nuevo Historial para un Paciente' })
  @Post()
  create(@Body() createHistorialDto: CreateHistorialDto) {
    return this.historialService.create(createHistorialDto);
  }

  @ApiOperation({ summary: 'Lista todos los Historiales' })
  @Get()
  findAll() {
    return this.historialService.findAll();
  }

  @ApiOperation({ summary: 'Muestra un Historial identificado por su ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historialService.findOne(+id);
  }

  @Roles('MEDICO')
  @ApiOperation({
    summary: 'Actualiza algun dato de un Historial identificado por su ID',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHistorialDto: UpdateHistorialDto,
  ) {
    return this.historialService.update(+id, updateHistorialDto);
  }

  @Roles('ADMIN', 'GERENCIA')
  @ApiOperation({ summary: 'Elimina un Historial identificado por su ID' })
  @Delete(':id')
  removeSoft(@Param('id') id: string) {
    return this.historialService.removeSoft(+id);
  }
}
