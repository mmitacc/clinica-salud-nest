import { Type } from 'class-transformer';
import { IsNotEmpty, IsInt, Min, Matches, IsNumber } from 'class-validator';

export class CreateConsultaDto {
  @Type(() => Number)
  @IsNotEmpty({ message: "El 'costo' es obligatorio." })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "El 'costo' debe ser un numero con hasta 2 decimales." },
  )
  @Min(0, { message: "El 'costo' no puede ser negativo." })
  readonly costo: number;

  // Los campos: fecha, horario; se uniran para formar "citadate" el cual se guardara en la BD
  @IsNotEmpty({ message: "La 'fecha' es obligatoria." })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "La 'fecha' debe tener el formato AAAA-MM-DD.",
  })
  readonly fecha: string;

  @IsNotEmpty({ message: "El 'horario' es obligatorio." })
  @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5]\d$/, {
    message: "El 'horario' debe tener el formato HH:MM (24h).",
  })
  readonly horario: string;
  // -------------------------------------------------------------------------------------------

  @Type(() => Number)
  @IsNotEmpty({ message: 'El "id_usuario" es obligatorio.' })
  @IsInt({ message: 'El "id_usuario" debe ser un numero entero.' })
  @Min(0, { message: 'El "id_usuario" no puede ser negativo.' })
  readonly id_usuario: number;

  @Type(() => Number)
  @IsNotEmpty({ message: 'El "id_paciente" es obligatorio.' })
  @IsInt({ message: 'El "id_paciente" debe ser un numero entero.' })
  @Min(0, { message: 'El "id_paciente" no puede ser negativo.' })
  readonly id_paciente: number;
}
