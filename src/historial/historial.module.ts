import { Module } from '@nestjs/common';
import { HistorialService } from './historial.service.js';
import { HistorialController } from './historial.controller.js';

@Module({
  controllers: [HistorialController],
  providers: [HistorialService],
})
export class HistorialModule {}
