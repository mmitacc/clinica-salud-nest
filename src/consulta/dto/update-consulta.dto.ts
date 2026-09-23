import { PartialType } from '@nestjs/swagger';
import { CreateConsultaDto } from './create-consulta.dto.js';

export class UpdateConsultaDto extends PartialType(CreateConsultaDto) {}
