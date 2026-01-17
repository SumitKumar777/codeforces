-- CreateEnum
CREATE TYPE "SubmissionVerdict" AS ENUM ('AC', 'WA', 'CE', 'RE', 'TLE', 'MLE', 'OLE', 'PE', 'ILE', 'SV', 'JE', 'SKIPPED', 'PENDING');

-- AlterEnum
ALTER TYPE "SubmissionState" ADD VALUE 'PROCESSING';

-- AlterTable
ALTER TABLE "Submissions" ADD COLUMN     "verdict" "SubmissionVerdict" NOT NULL DEFAULT 'PENDING';
