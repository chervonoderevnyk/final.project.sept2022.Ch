/*
  Warnings:

  - You are about to drop the column `manager` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `mentorId` on the `Orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Orders` DROP FOREIGN KEY `Orders_mentorId_fkey`;

-- DropIndex
DROP INDEX `ManagerIndex` ON `Orders`;

-- AlterTable
ALTER TABLE `Orders` DROP COLUMN `manager`,
    DROP COLUMN `mentorId`,
    ADD COLUMN `managerId` INTEGER NULL,
    ADD COLUMN `usersId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
