Backend Persistente con Prisma — Clínica Salud Integral

ANTECEDENTES:

La Clínica “Salud Integral” ha operado durante años usando hojas de cálculo, lo que ha provocado pérdida de datos y cruce de horarios en la atención médica. La junta directiva te contrató para solucionar la problemática actual: diseñar y desarrollar desde cero una API RESTful que sirva como núcleo para las futuras aplicaciones de recepcionistas, médicos y gerencia.

Módulo de Recepción (Pacientes y Directorio)
Alta de pacientes: los recepcionistas necesitan registrar a los pacientes nuevos capturando su información personal. El sistema debe rechazar correos mal formateados y fechas de nacimiento irreales (en el futuro).
Búsqueda de especialistas: cuando un paciente llega buscando atención, el recepcionista debe poder consultar una lista de todos los médicos de la clínica y filtrarlos rápidamente por su especialidad médica.
Consulta de expedientes: al buscar a un paciente específico, el sistema debe mostrar en una sola vista sus datos personales y el historial completo de todas las citas que ha tenido desde su registro.

Módulo de Consultorio (Agendamiento y Atención)
Programación de citas: se debe poder agendar una cita para un paciente con un médico en específico. Regla de negocio: el sistema debe bloquear cualquier intento de agendar una cita en una fecha que ya pasó.
Agenda del médico: los doctores necesitan abrir su aplicación y ver qué pacientes tienen programados, filtrando por un rango de fechas (desde qué día hasta qué día).
Gestión de estado: las citas nacen con estado “Programada”. Una vez que el médico atiende al paciente, o si el paciente no llega, el médico debe poder actualizar el estado de esa cita a “Completada” o “Cancelada”.

Módulo de Gerencia (Análisis de Datos)
Rentabilidad por área: el director general necesita un reporte que indique el volumen total de citas agendadas, agrupado por cada especialidad médica de la clínica.
Corte operativo diario: un reporte rápido que, al proporcionarle una fecha específica, devuelva exactamente cuántas citas se completaron y cuántas se cancelaron ese día.

ANALISIS:

Identificando las Principales Entidades:


## Entity: historial

| Atributo      | Tipo           | Notas       |
|---------------|----------------|-------------|
| id            | Número Entero  | [PK]        |
| id_paciente   | Número Entero  | [FK]        |
| motivo        | Texto          | Obligatorio |
| antecedentes  | Texto          |             |
| triaje        | Texto          | Obligatorio |
| diagnostico   | Texto          |             |
| tratamiento   | Texto          |             |
| receta        | Texto          |             |
| registerdate  | Date           | Date(now()) |


## Entity: paciente

| Atributo         | Tipo           | Notas       |
|------------------|----------------|-------------|
| id               | Número Entero  | [PK]        |
| nombres          | Texto          | Obligatorio |
| apellidos        | Texto          | Obligatorio |
| telefono         | Texto          | Obligatorio |
| email            | Texto          | Unico       |
| masculino        | Boolean        |             |
| fecha_nac        | Date           |>Date(now()) |
| tipo_sangre      | Texto          |             |
| alergias         | Texto          |             |
| registerdate     | Date           | Date(now()) |


## Entity: consulta

| Atributo      | Tipo           | Notas       |
|---------------|----------------|-------------|
| id            | Número Entero  | [PK]        |
| id_paciente   | Número Entero  | [FK]        |
| id_medico     | Número Entero  | [FK]        |
| estado        | Texto          | Obligatorio |
| citadate      | Date           | Obligatorio |
| costo         | Decimal        | Default(50) |
| registerdate  | Date           | Date(now()) |


## Entity: medico

| Atributo         | Tipo           | Notas       |
|------------------|----------------|-------------|
| id               | Número Entero  | [PK]        |
| id_especialidad  | Número Entero  | [FK]        |
| nombres          | Texto          | Obligatorio |
| apellidos        | Texto          | Obligatorio |
| telefono         | Texto          | Obligatorio |
| email            | Texto          | Unico       |
| masculino        | Boolean        |             |
| fecha_nac        | Date           |> Date(now())|
| registerdate  | Date           | Date(now()) |


## Entity: especialidad

| Atributo       | Tipo           | Notas       |
|----------------|----------------|-------------|
| id             | Número Entero  | [PK]        |
| tipo           | Texto          | Obligatorio |
| registerdate   | Date           | Date(now()) |


Describiendo las relaciones:

paciente (1) ----- (N) historial
"Un 'paciente' puede tener varios registros en su 'historial', pero un registro de 'historial' solo le pertenece a un 'paciente'."

paciente (1) ----- (N) consulta
"Un 'paciente' puede tener muchas 'consultas' medicas, pero una 'consulta' medica solo pertenece a un 'paciente'."

medico (1) ----- (N) consulta
"Un 'medico' puede hacer muchas 'consultas' medicas, pero una 'consulta' medica solo lo hace un 'medico'."

especialidad (1) ----- (N) medico
"Una 'especialidad' puede agrupar a muchos 'medicos', pero un 'medico' solo pertenece a una 'especialidad'."


DIAGRAMA DE ENTIDAD RELACIONAL: (Se adjunta en archivo: 'ERD-salud integral.png')

IMPLEMENTACION DE AUTENTICACION Y AUTORIZACION:

## Entity: usuario

| Atributo       | Tipo           | Notas       |
|----------------|----------------|-------------|
| id             | Número Entero  | [PK]        |
| email          | Texto          | Obligatorio |
| password       | Texto          | Obligatorio |
| role            | Texto          | Obligatorio |
| username       | Texto          | Obligatorio |
| registerdate   | Date           | Date(now()) |

Describiendo las nuevas relaciones:

usuario (1) ----- (1) medico
"Un 'usario' del sistema puede ser un 'medico', y un 'medico' puede ser un 'usuario' del sistema."

Permisos en el Backend (Controlado por JWT):

| Entidad       |  RECEPCIONISTA  |      MEDICO     |    GERENCIA     |      ADMIN      |
|---------------|-----------------|-----------------|-----------------|-----------------|
| Paciente      | Crear y Editar  | Solo ver        | TODOS           | TODOS + deleted |
| Consulta      | Crear y Editar  | Editar 'estado' | TODOS           | TODOS + deleted |
| Historial     | NINGUNO         | Crear y Editar  | TODOS           | TODOS + deleted |
| Especialidad  | Solo ver        | Solo ver        | TODOS           | TODOS + deleted |
| Medico        | Solo ver        | Solo ver        | TODOS           | TODOS + deleted |
| Usuario       | NINGUNO         | NINGUNO         | TODOS           | TODOS + deleted |


REQUERIMIENTOS RESUELTOS:

// ************ RECEPCION ***************//
// 1.- Alta de pacientes: (POST)
http://localhost:3000/paciente/

// 2.- Búsqueda de especialistas: (GET)
http://localhost:3000/medico?especialidad=urología

// 3.- Consulta de expedientes: (GET)
http://localhost:3000/paciente/4

// ************ CONSULTORIO **************//
// 1.- Programación de citas: (POST)
http://localhost:3000/consulta/

// 2.- Agenda del médico: (GET)
http://localhost:3000/medico/agenda/5?fechaInicio=2026-01-01&fechaFin=2026-09-05

// 3.- Gestión de estado: (PUT)
http://localhost:3000/consulta/cita/20

// *************** GERENCIA ***************//
// 1.- Rentabilidad por área: (GET)
http://localhost:3000/consulta/rentabilidad

// 2.- Corte operativo diario: (GET)
http://localhost:3000/consulta/corte-operativo?fechaInicio=2026-01-01&fechaFin=2026-09-04


// ************ ADMINISTRADOR-DB **********//
// 1.- Eliminación real de registros: (DELETE)
// (todas las tablas)
http://localhost:3000/paciente/admin/5

// 1.- Consulta total o rango de fechas de registros eliminados: (GET)
// (todas las tablas)
http://localhost:3000/paciente/admin?fechaInicio=2026-08-31&fechaFin=2026-09-02
