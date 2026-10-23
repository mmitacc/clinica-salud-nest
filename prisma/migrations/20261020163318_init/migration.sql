-- CreateEnum
CREATE TYPE "EstadoPaciente" AS ENUM ('ACTIVO', 'INACTIVO', 'EN_ESPERA');

-- AlterTable
ALTER TABLE "paciente" ADD COLUMN     "estado" "EstadoPaciente" NOT NULL DEFAULT 'ACTIVO';
