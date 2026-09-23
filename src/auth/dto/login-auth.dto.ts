import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Length,
} from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    example: 'user@dominio.com',
    description: 'Correo electrónico con formato correcto del Usuario',
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
    example: 'Secreto123',
    description: 'Contraseña secreta del Usuario',
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
}
