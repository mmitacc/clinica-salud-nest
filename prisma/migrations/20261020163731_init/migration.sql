/*
  Warnings:

  - The `tiposangre` column on the `paciente` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TipoSangre" AS ENUM ('O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-');

-- AlterTable
ALTER TABLE "paciente" DROP COLUMN "tiposangre",
ADD COLUMN     "tiposangre" "TipoSangre" NOT NULL DEFAULT 'O+';
