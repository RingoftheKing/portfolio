/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `AdminPageUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AdminPageUser_username_key" ON "AdminPageUser"("username");
