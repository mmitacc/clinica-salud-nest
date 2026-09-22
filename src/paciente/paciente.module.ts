import { Module } from '@nestjs/common';
import { PacienteService } from './paciente.service.js';
import { PacienteController } from './paciente.controller.js';

@Module({
  controllers: [PacienteController],
  providers: [PacienteService],
  exports: [PacienteService],
})
export class PacienteModule {}
