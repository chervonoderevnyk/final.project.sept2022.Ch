/*
  Warnings:

  - You are about to drop the `Orders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Orders`;

-- CreateTable
CREATE TABLE `orders` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
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
    `mentorId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `roles` ENUM('Admin', 'Manager') NULL DEFAULT 'Admin',

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_mentorId_fkey` FOREIGN KEY (`mentorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
