/*
  Warnings:

  - You are about to drop the column `img` on the `project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "project" RENAME COLUMN "img" TO "thumbnail_img";
ALTER TABLE "project" ADD COLUMN     "showcase_imgs" TEXT[];