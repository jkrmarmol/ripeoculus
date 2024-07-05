-- CreateTable
CREATE TABLE "Riple" (
    "id" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Riple_pkey" PRIMARY KEY ("id")
);
