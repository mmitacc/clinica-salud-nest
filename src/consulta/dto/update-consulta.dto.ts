import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateConsultaDto } from './create-consulta.dto.js';
import { EstadoCita } from '../../prisma/generated-client/enums.js';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateConsultaDto extends PartialType(CreateConsultaDto) {}

export class UpdateEstadoConsultaDto {
  @ApiProperty({
    example: 'PROGRAMADA',
    description: 'Detalla el estado actual de la Consulta Médica',
  })
  @IsNotEmpty({
    message: "El 'estado' es obligatorio y no debe contener solo espacios.",
  })
  @IsEnum(EstadoCita, {
    message: `El 'estado' debe ser uno de los siguientes valores: ${Object.values(EstadoCita).join(', ')}.`,
  })
  readonly estado: EstadoCita;
}
