import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../prisma/generated-client/enums.js';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Matches,
  Length,
  IsEnum,
  IsEmail,
  IsInt,
  Min,
  IsBoolean,
  IsDate,
  IsOptional,
} from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({
    example: 'Peter',
    description: 'Detalla los nombres del Usuario',
  })
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

  @ApiProperty({
    example: 'Parker',
    description: 'Detalla los apellidos del Usuario',
  })
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

  @ApiProperty({
    example: '+51 987564124',
    description:
      'Detalla el número de teléfono del Usuario incluido su código del país',
  })
  @IsString({ message: "El 'telefono' debe ser un texto." })
  @Transform(({ value }) => (typeof value === 'object' ? value.trim() : value))
  @IsNotEmpty({
    message: "El 'telefono' es obligatorio y no debe contener solo espacios.",
  })
  @Length(8, 20, {
    message: "El 'telefono' debe tener entre 8 y 20 caracteres.",
  })
  readonly telefono: string;

  @ApiProperty({
    example: 'peter',
    description: 'Detalla el username del Usuario',
  })
  @IsString({ message: "El 'username' debe ser un texto." })
  @Transform(({ value }) => (typeof value === 'object' ? value.trim() : value))
  @IsNotEmpty({
    message: "El 'username' es obligatorio y no debe contener solo espacios.",
  })
  @Length(4, 20, {
    message: "El 'username' debe tener entre 4 y 20 caracteres.",
  })
  @Matches(/^[a-zA-Z0-9._]+$/, {
    message:
      "El 'username' solo puede contener letras (mayúsculas/minúsculas), números, puntos y guiones bajos.",
  })
  readonly username: string;

  @ApiProperty({
    example: 'MEDICO',
    description: 'Detalla el role del Usuario',
  })
  @IsOptional()
  @IsEnum(Role, {
    message: `El 'role' debe ser uno de los siguientes valores: ${Object.values(Role).join(', ')}.`,
  })
  readonly role: Role;

  @ApiProperty({
    example: 'mi_password',
    description: 'Detalla la contraseña secreta del Usuario',
  })
  @Transform(({ value }) => (typeof value === 'object' ? value.trim() : value))
  @IsString({ message: "El 'password' debe ser un texto." })
  @IsNotEmpty({
    message: "El 'password' es obligatorio y no debe contener solo espacios.",
  })
  @Length(6, 20, {
    message: "El 'password' debe tener entre 6 y 20 caracteres.",
  })
  // @Matches(/[a-z]/, {
  //   message: "El 'password' debe contener al menos una letra minúscula.",
  // })
  // @Matches(/[A-Z]/, {
  //   message: "El 'password' debe contener al menos una letra mayúscula.",
  // })
  // @Matches(/[0-9]/, {
  //   message: "El 'password' debe contener al menos un número.",
  // })
  // @Matches(/[!@#$%^&*(),.?":{}|<>_+\-=\[\]\\\/]/, {
  //   message:
  //     "El 'password' debe contener al menos un carácter especial (ejemplo: !@#$%^&*(),.?:{}|<>_+-=[]/).",
  // })
  readonly password: string;

  @ApiProperty({
    example: 'peter@clinica.com',
    description: 'Detalla el email del Usuario con el formato correcto',
  })
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

  @ApiProperty({
    example: true,
    description: 'Detalla si el Usuario es de género masculino',
  })
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

  @ApiProperty({
    example: '1980-01-01',
    description:
      'Detalla la fecha de nacimiento del Usuario en formato internacional (AAAA-MM-DD)',
  })
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

  @ApiProperty({
    example: 4,
    description:
      'El ID de la Especialidad si el Usuario es un Médico, es un número entero y opcional',
  })
  @Type(() => Number)
  @IsNotEmpty({ message: 'El "id_especialidad" es obligatorio.' })
  @IsInt({ message: 'El "id_especialidad" debe ser un numero entero.' })
  @Min(0, { message: 'El "id_especialidad" no puede ser negativo.' })
  readonly id_especialidad?: number;
}
