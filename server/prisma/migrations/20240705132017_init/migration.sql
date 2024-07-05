/*
  Warnings:

  - A unique constraint covering the columns `[usersId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Profile_usersId_key" ON "Profile"("usersId");
