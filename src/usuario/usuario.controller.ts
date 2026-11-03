import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('usuarios')
@ApiBearerAuth()
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Roles('ADMIN', 'GERENCIA')
  @ApiOperation({ summary: 'Registra un nuevo Usuario' })
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @ApiOperation({ summary: 'Lista todos los Medicos con su especialidad' })
  @Get('/medico')
  findAllMedico() {
    return this.usuarioService.findAllMedico();
  }

  @Roles('ADMIN', 'GERENCIA')
  @ApiOperation({ summary: 'Lista todos los Usuarios' })
  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Roles('ADMIN', 'GERENCIA')
  @ApiOperation({ summary: 'Muestra un Usuario identificado por su ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id);
  }

  @Roles('ADMIN', 'GERENCIA')
  @ApiOperation({
    summary: 'Actualiza algún campo de un Usuario identificado por su ID',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }

  @Roles('ADMIN', 'GERENCIA')
  @ApiOperation({ summary: 'Elimina un Usuario identificado por su ID' })
  @Delete(':id')
  removeSoft(@Param('id') id: string) {
    return this.usuarioService.removeSoft(+id);
  }
}
