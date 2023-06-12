/*
  Warnings:

  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `orders`;

-- CreateTable
CREATE TABLE `Orders` (
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
    `created_at` DATETIME(6) NULL,
    `utm` VARCHAR(100) NULL,
    `msg` VARCHAR(100) NULL,
    `status` VARCHAR(15) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
