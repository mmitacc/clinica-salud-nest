// prisma-exception.filter.ts
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from './generated-client/client.js';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    switch (exception.code) {
      case 'P2002':
        return new ConflictException(
          'Ya existe un registro con ese valor único',
        ).getResponse();
      case 'P2003':
        return new BadRequestException(
          'Error de relación: El registro padre no existe o tiene dependencias.',
        ).getResponse();
      case 'P2004':
        return new BadRequestException(
          'Los datos proporcionados no cumplen con las reglas del sistema.',
        ).getResponse();
      case 'P2025':
        return new NotFoundException('Registro no encontrado').getResponse();
      default:
        throw exception;
    }
  }
}
