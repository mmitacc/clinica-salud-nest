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

@Controller('especialidad')
export class EspecialidadController {
  constructor(private readonly especialidadService: EspecialidadService) {}

  @Roles('ADMIN', 'GERENCIA')
  @Post()
  create(@Body() createEspecialidadDto: CreateEspecialidadDto) {
    return this.especialidadService.create(createEspecialidadDto);
  }

  @Get()
  findAll() {
    return this.especialidadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.especialidadService.findOne(+id);
  }

  @Roles('ADMIN', 'GERENCIA')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEspecialidadDto: UpdateEspecialidadDto,
  ) {
    return this.especialidadService.update(+id, updateEspecialidadDto);
  }

  @Roles('ADMIN', 'GERENCIA')
  @Delete(':id')
  removeSoft(@Param('id') id: string) {
    return this.especialidadService.removeSoft(+id);
  }
}
