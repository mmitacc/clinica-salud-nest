import { Module } from '@nestjs/common';
import { ConsultaService } from './consulta.service.js';
import { ConsultaController } from './consulta.controller.js';

@Module({
  controllers: [ConsultaController],
  providers: [ConsultaService],
})
export class ConsultaModule {}
