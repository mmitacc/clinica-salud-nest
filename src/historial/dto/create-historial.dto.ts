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
  @Type(() => Number)
  @IsNotEmpty({ message: 'El "id_paciente" es obligatorio.' })
  @IsInt({ message: 'El "id_paciente" debe ser un numero entero.' })
  @Min(0, { message: 'El "id_paciente" no puede ser negativo.' })
  readonly id_paciente: number;

  @IsString({ message: "El 'motivo' debe ser un texto." })
  @Transform(({ value }) => (typeof value === 'object' ? value.trim() : value))
  @IsNotEmpty({
    message: "El 'motivo' es obligatorio y no debe contener solo espacios.",
  })
  @Length(6, 100, {
    message: "El 'motivo' debe tener entre 6 y 100 caracteres.",
  })
  readonly motivo: string;

  @IsString({ message: "El 'triaje' debe ser un texto." })
  @Transform(({ value }) => (typeof value === 'object' ? value.trim() : value))
  @IsNotEmpty({
    message: "El 'triaje' es obligatorio y no debe contener solo espacios.",
  })
  @Length(8, 80, {
    message: "El 'triaje' debe tener entre 8 y 80 caracteres.",
  })
  readonly triaje: string;

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
