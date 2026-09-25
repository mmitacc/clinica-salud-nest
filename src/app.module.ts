import { Module } from '@nestjs/common';
// import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { PacienteModule } from './paciente/paciente.module.js';
import { UsuarioModule } from './usuario/usuario.module.js';
import { EspecialidadModule } from './especialidad/especialidad.module.js';
import { HistorialModule } from './historial/historial.module.js';
import { ConsultaModule } from './consulta/consulta.module.js';
import { AuthModule } from './auth/auth.module.js';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard.js';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

// export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().min(32).required(),
        PORT: Joi.number().default(3000),
      }),
    }),
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    // ==> Desinstalarlos, lentea el servidor: "pnpm remove @nestjs/observe @nestjs/mau"
    // ObserveModule.forRoot({
    //   appKey: 'YOUR_APP_KEY',
    //   appSecret: 'YOUR_APP_SECRET',
    //   serviceId: 'clinica-salud-nest',
    // }),
    PrismaModule,
    AuthModule,
    PacienteModule,
    ConsultaModule,
    EspecialidadModule,
    HistorialModule,
    UsuarioModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    AppService,
  ],
})
export class AppModule {}
