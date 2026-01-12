-- CreateEnum
CREATE TYPE "SubmissionState" AS ENUM ('PENDING', 'FAILED', 'SUCCESS');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Problems" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Problems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisibleTestCase" (
    "id" TEXT NOT NULL,
    "problemId" INTEGER NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,

    CONSTRAINT "VisibleTestCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HiddenTestCase" (
    "id" TEXT NOT NULL,
    "problemId" INTEGER NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,

    CONSTRAINT "HiddenTestCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" INTEGER NOT NULL,
    "state" "SubmissionState" NOT NULL DEFAULT 'PENDING',
    "AttemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VisibleTestCase_problemId_key" ON "VisibleTestCase"("problemId");

-- CreateIndex
CREATE UNIQUE INDEX "HiddenTestCase_problemId_key" ON "HiddenTestCase"("problemId");

-- AddForeignKey
ALTER TABLE "VisibleTestCase" ADD CONSTRAINT "VisibleTestCase_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HiddenTestCase" ADD CONSTRAINT "HiddenTestCase_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
