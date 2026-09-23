import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConsultaService } from './consulta.service.js';
import { CreateConsultaDto } from './dto/create-consulta.dto.js';
import { UpdateConsultaDto } from './dto/update-consulta.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('consulta')
export class ConsultaController {
  constructor(private readonly consultaService: ConsultaService) {}

  @Roles('RECEPCIONISTA')
  @ApiOperation({ summary: 'Registra una nueva Consulta' })
  @Post()
  create(@Body() createConsultaDto: CreateConsultaDto) {
    return this.consultaService.create(createConsultaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas las Consultas' })
  findAll() {
    return this.consultaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Muestra una Consulta identificada por su ID' })
  findOne(@Param('id') id: string) {
    return this.consultaService.findOne(+id);
  }

  @Roles('RECEPCIONISTA')
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualiza algun dato de una Consulta identificada por su ID',
  })
  update(
    @Param('id') id: string,
    @Body() updateConsultaDto: UpdateConsultaDto,
  ) {
    return this.consultaService.update(+id, updateConsultaDto);
  }

  @Roles('ADMIN', 'GERENCIA')
  @ApiOperation({ summary: 'Elimina una Consulta identificada por su ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consultaService.removeSoft(+id);
  }
}
