/*
  Warnings:

  - You are about to drop the column `userId` on the `Speaker` table. All the data in the column will be lost.
  - You are about to drop the column `userType` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Speaker` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `speakerId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Speaker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Speaker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Speaker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Speaker` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Booking` DROP FOREIGN KEY `Booking_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Speaker` DROP FOREIGN KEY `Speaker_userId_fkey`;

-- DropIndex
DROP INDEX `Speaker_userId_key` ON `Speaker`;

-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `speakerId` INTEGER NOT NULL,
    MODIFY `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Speaker` DROP COLUMN `userId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `userType`;

-- CreateIndex
CREATE UNIQUE INDEX `Speaker_email_key` ON `Speaker`(`email`);

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_speakerId_fkey` FOREIGN KEY (`speakerId`) REFERENCES `Speaker`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
