import { PrismaService } from '../src/prisma/prisma.service.js';
import { Role, EstadoCita } from '../src/prisma/generated-client/enums.js';
import bcrypt from 'bcryptjs';
const prisma = new PrismaService();

async function main() {
  console.log('Iniciando la siembra de datos (Seed)...');

  // Limpieza de la base de datos
  await prisma.historial.deleteMany();
  await prisma.consulta.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.paciente.deleteMany();
  await prisma.especialidad.deleteMany();

  // El orden es crucial (de tablas dependientes a principales) para evitar errores de llaves foráneas
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "historial" RESTART IDENTITY CASCADE;`,
  );
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "consulta" RESTART IDENTITY CASCADE;`,
  );
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "usuario" RESTART IDENTITY CASCADE;`,
  );
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "paciente" RESTART IDENTITY CASCADE;`,
  );
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "especialidad" RESTART IDENTITY CASCADE;`,
  );

  // 1. Insertar Especialidades (Exactamente 2)
  await prisma.especialidad.createMany({
    data: [{ tipo: 'Medicina General' }, { tipo: 'Pediatría' }],
  });

  // 2. Insertar Usuarios (Exactamente 5)
  const hashComun = await bcrypt.hash('123456', 10);
  await prisma.usuario.createMany({
    data: [
      {
        nombres: 'Manuel',
        apellidos: 'Mitacc',
        telefono: '+51996080313',
        masculino: true,
        fechanacimiento: new Date('1985-04-12'),
        email: 'manu@clinica.com',
        password: hashComun,
        role: Role.ADMIN,
        username: 'admin',
      },
      {
        nombres: 'Kevin',
        apellidos: 'Bolivar',
        telefono: '+51987654322',
        masculino: true,
        fechanacimiento: new Date('1988-08-24'),
        email: 'kevin@clinica.com',
        password: hashComun,
        role: Role.GERENCIA,
        username: 'kevin',
      },
      {
        nombres: 'Laura Sofía',
        apellidos: 'Mendoza Arce',
        telefono: '+51987654323',
        masculino: false,
        fechanacimiento: new Date('1995-11-03'),
        email: 'laura.recepcion@clinica.com',
        password: hashComun,
        role: Role.RECEPCIONISTA,
        username: 'laura_recep',
      },
      {
        nombres: 'Alejandro',
        apellidos: 'Peralta Ruiz',
        telefono: '+51987654324',
        masculino: true,
        fechanacimiento: new Date('1980-01-15'),
        email: 'alejandro.medico@clinica.com',
        password: hashComun,
        role: Role.MEDICO,
        username: 'dr_peralta',
        id_especialidad: 1,
      },
      {
        nombres: 'Beatriz Elena',
        apellidos: 'Villanueva Vega',
        telefono: '+51987654325',
        masculino: false,
        fechanacimiento: new Date('1983-06-30'),
        email: 'beatriz.medico@clinica.com',
        password: hashComun,
        role: Role.MEDICO,
        username: 'dra_villanueva',
        id_especialidad: 2,
      },
    ],
  });

  // 3. Insertar Pacientes (Exactamente 6)
  await prisma.paciente.createMany({
    data: [
      {
        nombres: 'Juan Pedro',
        apellidos: 'Pérez Quispe',
        telefono: '+51944555661',
        email: 'juan.perez@email.com',
        masculino: true,
        fechanacimiento: new Date('1990-05-15'),
        tiposangre: 'O+',
        alergias: 'Penicilina',
      },
      {
        nombres: 'María Fernanda',
        apellidos: 'Díaz Flores',
        telefono: '+51944555662',
        email: 'maria.diaz@email.com',
        masculino: false,
        fechanacimiento: new Date('1995-08-22'),
        tiposangre: 'A+',
      },
      {
        nombres: 'Luis Antonio',
        apellidos: 'Castro Vera',
        telefono: '+51944555663',
        email: 'luis.castro@email.com',
        masculino: true,
        fechanacimiento: new Date('1978-12-05'),
        tiposangre: 'O-',
      },
      {
        nombres: 'Ana Lucía',
        apellidos: 'Torres Rojas',
        telefono: '+51944555664',
        email: 'ana.torres@email.com',
        masculino: false,
        fechanacimiento: new Date('2018-03-14'),
        tiposangre: 'A+',
      }, // Candidato a pediatría
      {
        nombres: 'Gabriel José',
        apellidos: 'Mendoza Luna',
        telefono: '+51944555665',
        email: 'gabriel.mendoza@email.com',
        masculino: true,
        fechanacimiento: new Date('2020-07-19'),
        tiposangre: 'B+',
      }, // Candidato a pediatría
      {
        nombres: 'Carmen Rosa',
        apellidos: 'Palomino Soto',
        telefono: '+51944555666',
        email: 'carmen.palomino@email.com',
        masculino: false,
        fechanacimiento: new Date('1965-01-25'),
        tiposangre: 'AB+',
      },
    ],
  });

  // 4. Insertar Historiales (Exactamente 12)
  await prisma.historial.createMany({
    data: [
      {
        id_paciente: 1,
        motivo: 'Control anual',
        triaje: 'PA: 120/80, FC: 72, Temp: 36.5',
        diagnostico: 'Paciente sano',
        tratamiento: 'Continuar dieta balanceada',
        receta: 'Ninguna',
      },
      {
        id_paciente: 1,
        motivo: 'Resfriado común',
        triaje: 'Temp: 38.2, FC: 80',
        diagnostico: 'Rinofaringitis aguda',
        tratamiento: 'Reposo e hidratación',
        receta: 'Paracetamol 500mg cada 8h por 3 días',
      },
      {
        id_paciente: 2,
        motivo: 'Dolor estomacal',
        triaje: 'PA: 110/70, Temp: 37.0',
        diagnostico: 'Gastritis leve',
        tratamiento: 'Evitar grasas e irritantes',
        receta: 'Omeprazol 20mg en ayunas por 7 días',
      },
      {
        id_paciente: 2,
        motivo: 'Seguimiento de gastritis',
        triaje: 'PA: 115/75, Temp: 36.6',
        diagnostico: 'Gastritis en resolución',
        tratamiento: 'Alta médica',
        receta: 'Ninguna',
      },
      {
        id_paciente: 3,
        motivo: 'Evaluación de hipertensión',
        triaje: 'PA: 145/95, Temp: 36.8',
        diagnostico: 'Hipertensión arterial estadio 1',
        tratamiento: 'Monitoreo diario de presión',
        receta: 'Losartán 50mg diario',
      },
      {
        id_paciente: 3,
        motivo: 'Control de presión',
        triaje: 'PA: 125/82, Temp: 36.4',
        diagnostico: 'Hipertensión controlada',
        tratamiento: 'Mantener medicación',
        receta: 'Losartán 50mg diario',
      },
      {
        id_paciente: 4,
        motivo: 'Fiebre y tos',
        triaje: 'Temp: 39.0, Peso: 18kg',
        diagnostico: 'Faringitis amigdalina',
        tratamiento: 'Compresas frías para fiebre',
        receta: 'Ibuprofeno jarabe 5ml cada 8h',
      },
      {
        id_paciente: 4,
        motivo: 'Control de crecimiento',
        triaje: 'Peso: 19kg, Talla: 110cm',
        diagnostico: 'Desarrollo adecuado para la edad',
        tratamiento: 'Suplementos vitamínicos',
        receta: 'Gomitas de vitaminas 1 diaria',
      },
      {
        id_paciente: 5,
        motivo: 'Chequeo de vacunas',
        triaje: 'Temp: 36.7, Peso: 14kg',
        diagnostico: 'Esquema de vacunación al día',
        tratamiento: 'Ninguno',
        receta: 'Ninguna',
      },
      {
        id_paciente: 5,
        motivo: 'Alergia cutánea',
        triaje: 'Temp: 36.9, Peso: 14.5kg',
        diagnostico: 'Dermatitis atópica',
        tratamiento: 'Baños con jabón neutro',
        receta: 'Crema hidratante base + Cetirizina jarabe',
      },
      {
        id_paciente: 6,
        motivo: 'Dolor articular en rodilla',
        triaje: 'PA: 130/85, Temp: 36.5',
        diagnostico: 'Sospecha de artrosis',
        tratamiento: 'Evitar sobreesfuerzo, radiografía',
        receta: 'Glucosamina + Condroitina diario',
      },
      {
        id_paciente: 6,
        motivo: 'Revisión de radiografía',
        triaje: 'PA: 120/80',
        diagnostico: 'Artrosis incipiente de rodilla',
        tratamiento: 'Fisioterapia ligera',
        receta: 'Analgesia condicional al dolor',
      },
    ],
  });

  // 5. Insertar Consultas (Exactamente 12)
  await prisma.consulta.createMany({
    data: [
      {
        id_paciente: 1,
        id_usuario: 1,
        estado: EstadoCita.COMPLETADA,
        citadate: new Date('2026-01-10T09:00:00Z'),
        costo: 50.0,
      },
      {
        id_paciente: 1,
        id_usuario: 1,
        estado: EstadoCita.COMPLETADA,
        citadate: new Date('2026-02-15T10:30:00Z'),
        costo: 50.0,
      },
      {
        id_paciente: 2,
        id_usuario: 1,
        estado: EstadoCita.COMPLETADA,
        citadate: new Date('2026-03-01T11:00:00Z'),
        costo: 60.0,
      },
      {
        id_paciente: 2,
        id_usuario: 1,
        estado: EstadoCita.COMPLETADA,
        citadate: new Date('2026-03-15T16:00:00Z'),
        costo: 50.0,
      },
      {
        id_paciente: 3,
        id_usuario: 1,
        estado: EstadoCita.COMPLETADA,
        citadate: new Date('2026-04-10T08:30:00Z'),
        costo: 50.0,
      },
      {
        id_paciente: 3,
        id_usuario: 1,
        estado: EstadoCita.COMPLETADA,
        citadate: new Date('2026-05-12T09:15:00Z'),
        costo: 50.0,
      },
      {
        id_paciente: 4,
        id_usuario: 1,
        estado: EstadoCita.PROGRAMADA,
        citadate: new Date('2026-10-03T15:00:00Z'),
        costo: 70.0,
      }, // Pediatría
      {
        id_paciente: 4,
        id_usuario: 1,
        estado: EstadoCita.CANCELADA,
        citadate: new Date('2026-07-20T10:00:00Z'),
        costo: 50.0,
      },
      {
        id_paciente: 5,
        id_usuario: 2,
        estado: EstadoCita.COMPLETADA,
        citadate: new Date('2026-08-05T11:30:00Z'),
        costo: 70.0,
      },
      {
        id_paciente: 5,
        id_usuario: 2,
        estado: EstadoCita.COMPLETADA,
        citadate: new Date('2026-08-25T15:45:00Z'),
        costo: 50.0,
      },
      {
        id_paciente: 6,
        id_usuario: 2,
        estado: EstadoCita.CANCELADA,
        citadate: new Date('2026-09-01T12:00:00Z'),
        costo: 55.0,
      },
      {
        id_paciente: 6,
        id_usuario: 2,
        estado: EstadoCita.PROGRAMADA,
        citadate: new Date('2026-09-25T10:00:00Z'),
        costo: 50.0,
      }, // Próxima cita programada
    ],
  });

  console.log('Base de datos sembrada con éxito.');
  console.log('- 2 Especialidades creadas');
  console.log(
    '- 5 Usuarios creados (ADMIN, GERENCIA, RECEPCIONISTA, 2 MEDICO)',
  );
  console.log('- 6 Pacientes insertados');
  console.log('- 12 Historiales médicos relacionados creados');
  console.log('- 12 Consultas agendadas creadas');
}

main()
  .catch((error) => {
    console.error('Error al ejecutar el seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
