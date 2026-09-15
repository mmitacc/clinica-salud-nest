import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get('/medico')
  findAllMedico(@Query('especialidad') especialidadNombre?: string) {
    return this.usuarioService.findAllMedico(especialidadNombre);
  }

  @Get('/medico/agenda')
  findAgendaByDate(
    @Param('id') id: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.usuarioService.findAgendaByDate(
      +id,
      new Date(fechaInicio),
      new Date(fechaFin),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  removeSoft(@Param('id') id: string) {
    return this.usuarioService.removeSoft(+id);
  }

  @Delete('/admin/:id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }
}
