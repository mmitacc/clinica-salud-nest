// auth/guards/jwt-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import jwt from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Verificar si la ruta tiene el decorador @Public()
    const isPublic =
      this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler()) ||
      this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getClass());

    if (isPublic) return true;

    // 2. Extraer el token del encabezado 'Authorization'
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado.');
    }

    const token = authHeader.split(' ')[1]; // Tomamos únicamente el string del token

    try {
      // 3. Verificar el token usando jsonwebtoken y tu variable de entorno
      const secret = this.configService.getOrThrow<string>('JWT_SECRET');
      const payload = jwt.verify(token, secret) as any;

      // 4. Inyectar el usuario en la petición para que el RolesGuard lo lea
      request.user = {
        id: payload.sub || payload.id,
        email: payload.email,
        role: payload.role,
        nombre: payload.nombre,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado.');
    }
  }
}
