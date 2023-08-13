/*
  Warnings:

  - You are about to drop the column `firstname` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Passwordreset` table. All the data in the column will be lost.
  - The `createdAt` column on the `Passwordreset` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `firstname` on the `Rider` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `Rider` table. All the data in the column will be lost.
  - You are about to drop the column `lat` on the `Trips` table. All the data in the column will be lost.
  - You are about to drop the column `long` on the `Trips` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Userverification` table. All the data in the column will be lost.
  - The `createdAt` column on the `Userverification` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `tripId` on the `Wallets` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reference]` on the table `Transactions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[riderId]` on the table `Wallets` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[driverId]` on the table `Wallets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Passwordreset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Trips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Trips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Userverification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Fundaccountstatus" AS ENUM ('PROCESSING', 'SUCCESSFUL', 'DECLINED');

-- CreateEnum
CREATE TYPE "Cartype" AS ENUM ('STANDARD', 'DIAMOND');

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_driverId_fkey";

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_riderId_fkey";

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_tripId_fkey";

-- DropForeignKey
ALTER TABLE "Trips" DROP CONSTRAINT "Trips_driverId_fkey";

-- DropForeignKey
ALTER TABLE "Trips" DROP CONSTRAINT "Trips_riderId_fkey";

-- DropForeignKey
ALTER TABLE "Trips" DROP CONSTRAINT "Trips_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "Wallets" DROP CONSTRAINT "Wallets_driverId_fkey";

-- DropForeignKey
ALTER TABLE "Wallets" DROP CONSTRAINT "Wallets_riderId_fkey";

-- DropForeignKey
ALTER TABLE "Wallets" DROP CONSTRAINT "Wallets_tripId_fkey";

-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "firstname",
DROP COLUMN "lastname",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "mobile" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Passwordreset" DROP COLUMN "expiresAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "createdAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Rider" DROP COLUMN "firstname",
DROP COLUMN "lastname",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "latitude" INTEGER,
ADD COLUMN     "longitude" INTEGER,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "mobile" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'INACTIVE';

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "amount" SET DATA TYPE TEXT,
ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "riderId" DROP NOT NULL,
ALTER COLUMN "driverId" DROP NOT NULL,
ALTER COLUMN "tripId" DROP NOT NULL,
ALTER COLUMN "from" DROP NOT NULL,
ALTER COLUMN "to" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Trips" DROP COLUMN "lat",
DROP COLUMN "long",
ADD COLUMN     "carType" "Cartype" NOT NULL DEFAULT 'STANDARD',
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "kmTraveled" DROP NOT NULL,
ALTER COLUMN "driverId" DROP NOT NULL,
ALTER COLUMN "riderId" DROP NOT NULL,
ALTER COLUMN "vehicleId" DROP NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE TEXT,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Userverification" DROP COLUMN "expiresAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "createdAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Wallets" DROP COLUMN "tripId",
ALTER COLUMN "riderId" DROP NOT NULL,
ALTER COLUMN "driverId" DROP NOT NULL,
ALTER COLUMN "walletAddress" DROP NOT NULL,
ALTER COLUMN "walletBalance" DROP NOT NULL,
ALTER COLUMN "walletBalance" SET DATA TYPE TEXT,
ALTER COLUMN "deposited" SET DEFAULT 0,
ALTER COLUMN "withdrawn" SET DEFAULT 0,
ALTER COLUMN "noOfTrans" SET DEFAULT 0,
ALTER COLUMN "totalFares" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "FundWallet" (
    "id" SERIAL NOT NULL,
    "channel" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "riderId" INTEGER NOT NULL,
    "amount" TEXT NOT NULL,
    "transRef" TEXT NOT NULL,
    "status" "Fundaccountstatus" NOT NULL DEFAULT 'PROCESSING',
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FundWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "riderId" INTEGER,
    "driverId" INTEGER,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Emailverificationtoken" (
    "id" SERIAL NOT NULL,
    "references" TEXT NOT NULL,
    "riderEmail" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "requestIp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Emailverificationtoken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FundWallet_transRef_key" ON "FundWallet"("transRef");

-- CreateIndex
CREATE UNIQUE INDEX "Location_riderId_key" ON "Location"("riderId");

-- CreateIndex
CREATE UNIQUE INDEX "Location_driverId_key" ON "Location"("driverId");

-- CreateIndex
CREATE UNIQUE INDEX "Emailverificationtoken_references_key" ON "Emailverificationtoken"("references");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_reference_key" ON "Transactions"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Wallets_riderId_key" ON "Wallets"("riderId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallets_driverId_key" ON "Wallets"("driverId");

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallets" ADD CONSTRAINT "Wallets_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallets" ADD CONSTRAINT "Wallets_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundWallet" ADD CONSTRAINT "FundWallet_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;
