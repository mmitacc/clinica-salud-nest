/*
  Warnings:

  - The values [O+,O-,A+,A-,B+,B-,AB+,AB-] on the enum `TipoSangre` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TipoSangre_new" AS ENUM ('O_POS', 'O_NEG', 'A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG');
ALTER TABLE "public"."paciente" ALTER COLUMN "tiposangre" DROP DEFAULT;
ALTER TABLE "paciente" ALTER COLUMN "tiposangre" TYPE "TipoSangre_new" USING ("tiposangre"::text::"TipoSangre_new");
ALTER TYPE "TipoSangre" RENAME TO "TipoSangre_old";
ALTER TYPE "TipoSangre_new" RENAME TO "TipoSangre";
DROP TYPE "public"."TipoSangre_old";
ALTER TABLE "paciente" ALTER COLUMN "tiposangre" SET DEFAULT 'O_POS';
COMMIT;

-- AlterTable
ALTER TABLE "paciente" ALTER COLUMN "tiposangre" SET DEFAULT 'O_POS';
