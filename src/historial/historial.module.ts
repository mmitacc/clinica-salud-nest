import { Module } from '@nestjs/common';
import { HistorialService } from './historial.service.js';
import { HistorialController } from './historial.controller.js';
import { PacienteModule } from '../paciente/paciente.module.js';

@Module({
  imports: [PacienteModule],
  controllers: [HistorialController],
  providers: [HistorialService],
})
export class HistorialModule {}
