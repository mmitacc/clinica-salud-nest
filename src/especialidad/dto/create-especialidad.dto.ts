import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateEspecialidadDto {
  @ApiProperty({
    example: 'Psicología',
    description: 'Detalla el tipo de Especialidad',
  })
  @IsString({ message: "El 'tipo' debe ser un texto." })
  @Transform(({ value }) => (typeof value === 'object' ? value.trim() : value))
  @IsNotEmpty({
    message: "El 'tipo' es obligatorio y no debe contener solo espacios.",
  })
  @Length(6, 30, {
    message: "El 'tipo' debe tener entre 6 y 30 caracteres.",
  })
  readonly tipo: string;
}
