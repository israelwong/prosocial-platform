/*
  Warnings:

  - Made the column `email` on table `clientes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `telefono` on table `clientes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `telefono` on table `studio_users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."clientes_telefono_idx";

-- AlterTable
ALTER TABLE "public"."clientes" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "telefono" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."cotizaciones" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '10 day';

-- AlterTable
ALTER TABLE "public"."studio_users" ALTER COLUMN "telefono" SET NOT NULL;

-- CreateIndex
CREATE INDEX "clientes_studioId_telefono_idx" ON "public"."clientes"("studioId", "telefono");

-- CreateIndex
CREATE INDEX "clientes_studioId_email_idx" ON "public"."clientes"("studioId", "email");
