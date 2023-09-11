/*
  Warnings:

  - You are about to drop the column `comment` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `managerId` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `usersId` on the `Orders` table. All the data in the column will be lost.
  - You are about to alter the column `course` on the `Orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Enum(EnumId(0))`.
  - You are about to alter the column `course_format` on the `Orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(15)` to `Enum(EnumId(1))`.
  - You are about to alter the column `course_type` on the `Orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `Enum(EnumId(2))`.
  - You are about to alter the column `group` on the `Orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(61)`.
  - You are about to alter the column `manager` on the `Orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(25)`.
  - You are about to alter the column `lastName` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(25)`.
  - You are about to alter the column `firstName` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(25)`.

*/
-- DropForeignKey
ALTER TABLE `Orders` DROP FOREIGN KEY `Orders_managerId_fkey`;

-- DropIndex
DROP INDEX `GroupIndex` ON `Orders`;

-- DropIndex
DROP INDEX `StatusIndex` ON `Orders`;

-- AlterTable
ALTER TABLE `Orders` DROP COLUMN `comment`,
    DROP COLUMN `managerId`,
    DROP COLUMN `usersId`,
    ADD COLUMN `managerInfo` INTEGER NULL,
    MODIFY `course` ENUM('FS', 'QACX', 'JCX', 'JSCX', 'FE', 'PCX') NULL,
    MODIFY `course_format` ENUM('static', 'online') NULL,
    MODIFY `course_type` ENUM('pro', 'minimal', 'premium', 'incubator', 'vip') NULL,
    MODIFY `group` VARCHAR(61) NULL,
    MODIFY `manager` VARCHAR(25) NULL;

-- AlterTable
ALTER TABLE `Users` MODIFY `lastName` VARCHAR(25) NULL,
    MODIFY `firstName` VARCHAR(25) NULL,
    ALTER COLUMN `roles` DROP DEFAULT;

-- CreateTable
CREATE TABLE `Comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `commentText` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `orderId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NULL,
    `orderId` INTEGER NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Group_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `LastNameIndex` ON `Users`(`lastName`);

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_managerInfo_fkey` FOREIGN KEY (`managerInfo`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Group` ADD CONSTRAINT `Group_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Group` ADD CONSTRAINT `Group_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
