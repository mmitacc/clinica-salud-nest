import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/logging.interceptor.js';
import { ConfigService } from '@nestjs/config';
import { TransformerInterceptor } from './common/transformer.interceptor.js';
// import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // instrument: ObserveInstrument,
  });

  // Prefijo global para todas las rutas: '/api'
  app.setGlobalPrefix('api');

  // Filtro para prisma de uso global
  app.useGlobalFilters(new PrismaExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Clínica: SALUD INTEGRAL')
    .setDescription('API de la clínica, migrada a NestJS. Por mmitacc.')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformerInterceptor());

  const configService = app.get(ConfigService);

  // === CONFIGURACIÓN DE CORS ===
  app.enableCors({
    origin: [
      configService.get<string>('FRONTEND_URL'),
      'http://localhost:5174',
    ], // URL de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Requerido si envías cookies o headers de sesión (ej. HttpOnly cookies)
    allowedHeaders: 'Content-Type, Authorization', // Asegura que estos headers estén permitidos
  });

  await app.listen(configService.getOrThrow<number>('PORT') ?? 3000);
}
await bootstrap();
