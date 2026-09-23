import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsInt,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateHistorialDto {
  @ApiProperty({
    example: 3,
    description: 'El ID del Paciente es número entero',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'El "id_paciente" es obligatorio.' })
  @IsInt({ message: 'El "id_paciente" debe ser un numero entero.' })
  @Min(0, { message: 'El "id_paciente" no puede ser negativo.' })
  readonly id_paciente: number;

  @ApiProperty({
    example: 'Desmayos Frecuentes',
    description:
      'Detalla el motivo por el cual el paciente se acerco a la Clínica',
  })
  @IsString({ message: "El 'motivo' debe ser un texto." })
  @Transform(({ value }) => (typeof value === 'object' ? value.trim() : value))
  @IsNotEmpty({
    message: "El 'motivo' es obligatorio y no debe contener solo espacios.",
  })
  @Length(6, 100, {
    message: "El 'motivo' debe tener entre 6 y 100 caracteres.",
  })
  readonly motivo: string;

  @ApiProperty({
    example: 'PA: 120/80, FC: 72, Temp: 36.5',
    description:
      'Detalla las medidas de salud basicas del paciente al ingresar a la Consulta Médica',
  })
  @IsString({ message: "El 'triaje' debe ser un texto." })
  @Transform(({ value }) => (typeof value === 'object' ? value.trim() : value))
  @IsNotEmpty({
    message: "El 'triaje' es obligatorio y no debe contener solo espacios.",
  })
  @Length(8, 80, {
    message: "El 'triaje' debe tener entre 8 y 80 caracteres.",
  })
  readonly triaje: string;

  @ApiProperty({
    example: 'Segunda vez en la semana por el mismo problema médico',
    description:
      'Detalla alguna información historica importante sobre su visita actual. Es opcional',
  })
  @ValidateIf(
    (objeto) =>
      objeto.antecedentes !== undefined &&
      objeto.antecedentes !== null &&
      objeto.antecedentes !== '',
  )
  @Transform(({ value }) => (typeof value === 'object' ? value.trim() : value))
  @IsString({ message: "Los 'antecedentes' deben ser un texto." })
  @Length(6, 300, {
    message: "Los 'antecedentes' deben tener entre 6 y 300 caracteres.",
  })
  readonly antecedentes?: string;

  @ApiProperty({
    example: 'Hipertensión en fase de inicio',
    description: 'Detalla el diagnóstico médico del paciente. Es opcional',
  })
  @ValidateIf(
    (objeto) =>
      objeto.diagnostico !== undefined &&
      objeto.diagnostico !== null &&
      objeto.diagnostico !== '',
  )
  @Transform(({ value }) => (typeof value === 'object' ? value.trim() : value))
  @IsString({ message: "El 'diagnostico' debe ser un texto." })
  @Length(6, 500, {
    message: "El 'diagnostico' debe tener entre 6 y 500 caracteres.",
  })
  readonly diagnostico?: string;

  @ApiProperty({
    example: 'Mantener medicación y cambio de hábitos alimenticios',
    description:
      'Detalla el tratamiento emitido por el Médico para el paciente. Es opcional',
  })
  @ValidateIf(
    (objeto) =>
      objeto.tratamiento !== undefined &&
      objeto.tratamiento !== null &&
      objeto.tratamiento !== '',
  )
  @Transform(({ value }) => (typeof value === 'object' ? value.trim() : value))
  @IsString({ message: "El 'tratamiento' debe ser un texto." })
  @Length(6, 300, {
    message: "El 'tratamiento' debe tener entre 6 y 300 caracteres.",
  })
  readonly tratamiento?: string;

  @ApiProperty({
    example: 'Losartán 50mg c/8Hrs por 5 dias',
    description:
      'Detalla el medicamente autorizado por el Médico para el paciente. Es opcional',
  })
  @ValidateIf(
    (objeto) =>
      objeto.receta !== undefined &&
      objeto.receta !== null &&
      objeto.receta !== '',
  )
  @Transform(({ value }) => (typeof value === 'object' ? value.trim() : value))
  @IsString({ message: "La 'receta' debe ser un texto." })
  @Length(6, 300, {
    message: "La 'receta' debe tener entre 6 y 300 caracteres.",
  })
  readonly receta?: string;
}
