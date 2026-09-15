import { Role } from '../../prisma/generated-client/enums.js';

export class CreateUsuarioDto {
  nombres: string;
  apellidos: string;
  telefono: string;
  username: string;
  role: Role;
  hashedPassword: string;
  email: string;
  masculino: boolean;
  fechanacimiento: Date;
  id_especialidad?: number;
}
