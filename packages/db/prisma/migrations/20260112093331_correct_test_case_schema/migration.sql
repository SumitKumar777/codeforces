/*
  Warnings:

  - Added the required column `order` to the `HiddenTestCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `VisibleTestCase` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "HiddenTestCase_problemId_key";

-- DropIndex
DROP INDEX "VisibleTestCase_problemId_key";

-- AlterTable
ALTER TABLE "HiddenTestCase" ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "VisibleTestCase" ADD COLUMN     "order" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "HiddenTestCase_problemId_idx" ON "HiddenTestCase"("problemId");

-- CreateIndex
CREATE INDEX "VisibleTestCase_problemId_idx" ON "VisibleTestCase"("problemId");
