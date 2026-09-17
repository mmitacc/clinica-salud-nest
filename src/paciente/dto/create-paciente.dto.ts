import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsEmail,
  IsBoolean,
  IsDate,
} from 'class-validator';

export class CreatePacienteDto {
  @IsString({ message: "Los 'nombres' deben ser un texto." })
  @Transform(({ value }) => (typeof value === 'object' ? value.trim() : value))
  @IsNotEmpty({
    message:
      "Los 'nombres' son obligatorios y no deben contener solo espacios.",
  })
  @Length(2, 50, {
    message: "Los 'nombres' deben tener entre 2 y 50 caracteres.",
  })
  readonly nombres: string;

  @IsString({ message: "Los 'apellidos' deben ser un texto." })
  @Transform(({ value }) => (typeof value === 'object' ? value.trim() : value))
  @IsNotEmpty({
    message:
      "Los 'apellidos' son obligatorios y no deben contener solo espacios.",
  })
  @Length(2, 50, {
    message: "Los 'apellidos' deben tener entre 2 y 50 caracteres.",
  })
  readonly apellidos: string;

  @IsString({ message: "El 'telefono' debe ser un texto." })
  @Transform(({ value }) => (typeof value === 'object' ? value.trim() : value))
  @IsNotEmpty({
    message: "El 'telefono' es obligatorio y no debe contener solo espacios.",
  })
  @Length(8, 20, {
    message: "El 'telefono' debe tener entre 8 y 20 caracteres.",
  })
  readonly telefono: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString({ message: "El 'email' debe ser un texto." })
  @IsNotEmpty({ message: "El 'email' es obligatorio." })
  @IsEmail(
    {},
    {
      message:
        "El 'email' debe tener un formato correcto (ejemplo@dominio.com).",
    },
  )
  readonly email: string;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsNotEmpty({ message: "El campo 'masculino' es obligatorio." })
  @IsBoolean({
    message: "El campo 'masculino' debe ser un valor booleano (true o false).",
  })
  readonly masculino: boolean;

  @Transform(({ value }) => {
    if (value instanceof Date) return value;
    const fecha = new Date(value);
    return isNaN(fecha.getTime()) ? value : fecha;
  })
  @IsNotEmpty({ message: "La 'fechanacimiento' es obligatoria." })
  @IsDate({
    message:
      "La 'fechanacimiento' debe ser una fecha válida en formato estándar (AAAA-MM-DD).",
  })
  readonly fechanacimiento: Date;

  @IsString({ message: "El 'tiposangre' debe ser un texto." })
  @Transform(({ value }) => (typeof value === 'object' ? value.trim() : value))
  @IsNotEmpty({
    message: "El 'tiposangre' es obligatorio y no debe contener solo espacios.",
  })
  @Length(2, 3, {
    message: "El 'tiposangre' debe tener entre 2 y 3 caracteres.",
  })
  readonly tiposangre: string;

  @IsString({ message: "Las 'alergias' deben ser un texto." })
  @Transform(({ value }) => (typeof value === 'object' ? value.trim() : value))
  @IsNotEmpty({
    message:
      "Las 'alergias' son un dato obligatorio y no deben contener solo espacios.",
  })
  @Length(7, 150, {
    message: "Las 'alergias' deben tener entre 7 y 150 caracteres.",
  })
  readonly alergias: string;
}
