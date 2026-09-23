import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/logging.interceptor.js';
// import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // instrument: ObserveInstrument,
  });

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
    .setDescription('API de la clínica, migrada a NestJS')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
