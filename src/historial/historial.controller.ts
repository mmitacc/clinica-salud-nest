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

@Controller('historial')
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  @Roles('MEDICO')
  @Post()
  create(@Body() createHistorialDto: CreateHistorialDto) {
    return this.historialService.create(createHistorialDto);
  }

  @Get()
  findAll() {
    return this.historialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historialService.findOne(+id);
  }

  @Roles('MEDICO')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHistorialDto: UpdateHistorialDto,
  ) {
    return this.historialService.update(+id, updateHistorialDto);
  }

  @Roles('ADMIN', 'GERENCIA')
  @Delete(':id')
  removeSoft(@Param('id') id: string) {
    return this.historialService.removeSoft(+id);
  }
}
