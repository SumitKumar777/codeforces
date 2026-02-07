/*
  Warnings:

  - You are about to drop the column `output` on the `HiddenTestCase` table. All the data in the column will be lost.
  - You are about to drop the column `output` on the `VisibleTestCase` table. All the data in the column will be lost.
  - Added the required column `expected_output` to the `HiddenTestCase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `constraints` to the `Problems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `problem_slug` to the `Problems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expected_output` to the `VisibleTestCase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE hiddentestcase_order_seq;
ALTER TABLE "HiddenTestCase" DROP COLUMN "output",
ADD COLUMN     "expected_output" TEXT NOT NULL,
ALTER COLUMN "order" SET DEFAULT nextval('hiddentestcase_order_seq');
ALTER SEQUENCE hiddentestcase_order_seq OWNED BY "HiddenTestCase"."order";

-- AlterTable
ALTER TABLE "Problems" ADD COLUMN     "constraints" TEXT NOT NULL,
ADD COLUMN     "problem_slug" TEXT NOT NULL;

-- AlterTable
CREATE SEQUENCE visibletestcase_order_seq;
ALTER TABLE "VisibleTestCase" DROP COLUMN "output",
ADD COLUMN     "expected_output" TEXT NOT NULL,
ALTER COLUMN "order" SET DEFAULT nextval('visibletestcase_order_seq');
ALTER SEQUENCE visibletestcase_order_seq OWNED BY "VisibleTestCase"."order";
