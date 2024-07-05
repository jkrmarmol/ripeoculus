/*
  Warnings:

  - You are about to drop the `Riple` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Riple";

-- CreateTable
CREATE TABLE "Ripe" (
    "id" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ripe_pkey" PRIMARY KEY ("id")
);
