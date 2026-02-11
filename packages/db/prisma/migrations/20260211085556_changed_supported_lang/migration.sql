/*
  Warnings:

  - The values [RUST,GO] on the enum `LanguageType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LanguageType_new" AS ENUM ('CPP', 'JS', 'PY');
ALTER TABLE "public"."Submissions" ALTER COLUMN "language" DROP DEFAULT;
ALTER TABLE "Submissions" ALTER COLUMN "language" TYPE "LanguageType_new" USING ("language"::text::"LanguageType_new");
ALTER TYPE "LanguageType" RENAME TO "LanguageType_old";
ALTER TYPE "LanguageType_new" RENAME TO "LanguageType";
DROP TYPE "public"."LanguageType_old";
ALTER TABLE "Submissions" ALTER COLUMN "language" SET DEFAULT 'CPP';
COMMIT;
