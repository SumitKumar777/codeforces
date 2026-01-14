/*
  Warnings:

  - Added the required column `inputStatement` to the `Problems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outputStatement` to the `Problems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problems" ADD COLUMN     "inputStatement" TEXT NOT NULL,
ADD COLUMN     "outputStatement" TEXT NOT NULL;
