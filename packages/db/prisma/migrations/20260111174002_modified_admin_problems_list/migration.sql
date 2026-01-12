/*
  Warnings:

  - Added the required column `adminId` to the `Problems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problems" ADD COLUMN     "adminId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Problems" ADD CONSTRAINT "Problems_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
