-- AlterTable
ALTER TABLE "Venta" ADD COLUMN     "metodoPago" "MetodoPago" NOT NULL DEFAULT 'EFECTIVO',
ADD COLUMN     "referencia" TEXT;
