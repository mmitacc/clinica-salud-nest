import { Module } from '@nestjs/common';
import { EspecialidadService } from './especialidad.service.js';
import { EspecialidadController } from './especialidad.controller.js';

@Module({
  controllers: [EspecialidadController],
  providers: [EspecialidadService],
  exports: [EspecialidadService],
})
export class EspecialidadModule {}
