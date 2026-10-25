/*
  Warnings:

  - You are about to drop the column `motivo` on the `historial` table. All the data in the column will be lost.
  - Added the required column `motivo` to the `consulta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "consulta" ADD COLUMN     "motivo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "historial" DROP COLUMN "motivo";
