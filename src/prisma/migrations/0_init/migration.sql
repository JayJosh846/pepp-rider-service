-- CreateEnum
CREATE TYPE "Role" AS ENUM ('RIDER', 'DRIVER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Ratings" AS ENUM ('ONE', 'TWO', 'THREE', 'FOUR', 'FIVE');

-- CreateEnum
CREATE TYPE "Userstatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "Tripstatus" AS ENUM ('ONGOING', 'CANCELLED', 'STOPPED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "Transactiontype" AS ENUM ('WITHDRAW', 'DEPOSIT', 'PAYMENT', 'TRANSFER');

-- CreateEnum
CREATE TYPE "Transactionstatus" AS ENUM ('PENDING', 'COMPLETE', 'FAIL');

-- CreateTable
CREATE TABLE "Rider" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "peppTag" TEXT,
    "homeAddress" TEXT,
    "workAddress" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "mobileVerified" BOOLEAN NOT NULL DEFAULT false,
    "enabled2FA" BOOLEAN NOT NULL DEFAULT false,
    "enabledGoogle" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'RIDER',
    "ratings" "Ratings" NOT NULL DEFAULT 'ONE',
    "status" "Userstatus" NOT NULL DEFAULT 'ACTIVE',
    "noOfRides" INTEGER,
    "kmTraveled" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "peppTag" TEXT,
    "homeAddress" TEXT,
    "workAddress" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "mobileVerified" BOOLEAN NOT NULL DEFAULT false,
    "enabled2FA" BOOLEAN NOT NULL DEFAULT false,
    "enabledGoogle" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'DRIVER',
    "ratings" "Ratings" NOT NULL DEFAULT 'ONE',
    "status" "Userstatus" NOT NULL DEFAULT 'ACTIVE',
    "noOfRides" INTEGER,
    "kmTraveled" INTEGER,
    "about" TEXT,
    "driverPhoto" BYTEA,
    "driverLicense" BYTEA,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trips" (
    "id" SERIAL NOT NULL,
    "pickUp" TEXT NOT NULL,
    "dropOff" TEXT NOT NULL,
    "kmTraveled" TEXT NOT NULL,
    "driverId" INTEGER NOT NULL,
    "riderId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "long" INTEGER NOT NULL,
    "lat" INTEGER NOT NULL,
    "status" "Tripstatus" NOT NULL DEFAULT 'ONGOING',
    "ratings" "Ratings" NOT NULL DEFAULT 'ONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallets" (
    "id" SERIAL NOT NULL,
    "riderId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "tripId" INTEGER NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "walletBalance" INTEGER NOT NULL,
    "deposited" INTEGER,
    "withdrawn" INTEGER,
    "noOfTrans" INTEGER,
    "totalFares" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" SERIAL NOT NULL,
    "reference" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "Transactiontype" NOT NULL,
    "status" "Transactionstatus" NOT NULL,
    "riderId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "tripId" INTEGER NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "vehicleReg" BYTEA,
    "vehincleIns" BYTEA,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" SERIAL NOT NULL,
    "bankcode" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "riderId" INTEGER,
    "driverId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Userverification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" INTEGER NOT NULL,
    "uniqueString" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "expiresAt" INTEGER NOT NULL,

    CONSTRAINT "Userverification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Passwordreset" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" INTEGER NOT NULL,
    "resetString" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL,
    "expiresAt" INTEGER NOT NULL,

    CONSTRAINT "Passwordreset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rider_email_key" ON "Rider"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Rider_mobile_key" ON "Rider"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Rider_peppTag_key" ON "Rider"("peppTag");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_mobile_key" ON "Driver"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_peppTag_key" ON "Driver"("peppTag");

-- CreateIndex
CREATE UNIQUE INDEX "Userverification_userId_key" ON "Userverification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Passwordreset_userId_key" ON "Passwordreset"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Passwordreset_resetString_key" ON "Passwordreset"("resetString");

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallets" ADD CONSTRAINT "Wallets_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallets" ADD CONSTRAINT "Wallets_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallets" ADD CONSTRAINT "Wallets_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

