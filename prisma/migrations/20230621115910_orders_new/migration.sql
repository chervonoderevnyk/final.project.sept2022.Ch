/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_mentorId_fkey`;

-- DropTable
DROP TABLE `User`;

-- DropTable
DROP TABLE `orders`;

-- CreateTable
CREATE TABLE `Orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(25) NULL,
    `surname` VARCHAR(25) NULL,
    `email` VARCHAR(100) NULL,
    `phone` VARCHAR(12) NULL,
    `age` INTEGER NULL,
    `course` VARCHAR(10) NULL,
    `course_format` VARCHAR(15) NULL,
    `course_type` VARCHAR(100) NULL,
    `sum` INTEGER NULL,
    `alreadyPaid` INTEGER NULL,
    `group` VARCHAR(191) NULL,
    `created_at` DATETIME(6) NULL,
    `utm` VARCHAR(100) NULL,
    `msg` VARCHAR(100) NULL,
    `status` VARCHAR(15) NULL,
    `manager` VARCHAR(191) NULL,
    `comment` VARCHAR(100) NULL,
    `mentorId` INTEGER NULL,

    INDEX `IdIndex`(`id`),
    INDEX `NameSurnameIndex`(`name`, `surname`),
    INDEX `CourseFormatIndex`(`course`),
    INDEX `Course_formatFormatIndex`(`course_format`),
    INDEX `Course_typeFormatIndex`(`course_type`),
    INDEX `CreatedAtIndex`(`created_at`),
    INDEX `AgeIndex`(`age`),
    INDEX `EmailIndex`(`email`),
    INDEX `PhoneIndex`(`phone`),
    INDEX `SumIndex`(`sum`),
    INDEX `AlreadyPaidIndex`(`alreadyPaid`),
    INDEX `GroupIndex`(`group`),
    INDEX `UtmIndex`(`utm`),
    INDEX `MsgIndex`(`msg`),
    INDEX `StatusIndex`(`status`),
    INDEX `ManagerIndex`(`manager`),
    INDEX `MentorIdIndex`(`mentorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `roles` ENUM('Admin', 'Manager') NULL DEFAULT 'Admin',

    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_mentorId_fkey` FOREIGN KEY (`mentorId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
