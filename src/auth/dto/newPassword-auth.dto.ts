import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, Length } from 'class-validator';

export class NewPasswordDto {
  @ApiProperty({
    example: 'Secreto123',
    description: 'Nueva contraseña secreta segura del Usuario',
  })
  @Transform(({ value }) => (typeof value === 'object' ? value.trim() : value))
  @IsString({ message: "El 'password' debe ser un texto." })
  @IsNotEmpty({
    message: "El 'password' es obligatorio y no debe contener solo espacios.",
  })
  @Length(6, 20, {
    message: "El 'password' debe tener entre 6 y 20 caracteres.",
  })
  @Matches(/[a-z]/, {
    message: "El 'password' debe contener al menos una letra minúscula.",
  })
  @Matches(/[A-Z]/, {
    message: "El 'password' debe contener al menos una letra mayúscula.",
  })
  @Matches(/[0-9]/, {
    message: "El 'password' debe contener al menos un número.",
  })
  @Matches(/[!@#$%^&*(),.?":{}|<>_+\-=\[\]\\\/]/, {
    message:
      "El 'password' debe contener al menos un carácter especial (ejemplo: !@#$%^&*(),.?:{}|<>_+-=[]/).",
  })
  readonly password: string;
}
