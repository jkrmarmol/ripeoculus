/*
  Warnings:

  - Added the required column `usersId` to the `Ripe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ripe" ADD COLUMN     "usersId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Ripe" ADD CONSTRAINT "Ripe_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
