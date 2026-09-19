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

@Controller('consulta')
export class ConsultaController {
  constructor(private readonly consultaService: ConsultaService) {}

  @Roles('RECEPCIONISTA')
  @Post()
  create(@Body() createConsultaDto: CreateConsultaDto) {
    return this.consultaService.create(createConsultaDto);
  }

  @Get()
  findAll() {
    return this.consultaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consultaService.findOne(+id);
  }

  @Roles('RECEPCIONISTA')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConsultaDto: UpdateConsultaDto,
  ) {
    return this.consultaService.update(+id, updateConsultaDto);
  }

  @Roles('ADMIN', 'GERENCIA')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consultaService.removeSoft(+id);
  }
}
