/*
  Warnings:

  - You are about to drop the column `location` on the `Click` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Click" DROP COLUMN "location",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "loc" TEXT,
ADD COLUMN     "org" TEXT,
ADD COLUMN     "region" TEXT,
ALTER COLUMN "userAgent" DROP NOT NULL;
