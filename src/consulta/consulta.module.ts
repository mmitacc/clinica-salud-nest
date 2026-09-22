import { Module } from '@nestjs/common';
import { ConsultaService } from './consulta.service.js';
import { ConsultaController } from './consulta.controller.js';
import { PacienteModule } from '../paciente/paciente.module.js';
import { UsuarioModule } from '../usuario/usuario.module.js';

@Module({
  imports: [PacienteModule, UsuarioModule],
  controllers: [ConsultaController],
  providers: [ConsultaService],
})
export class ConsultaModule {}
