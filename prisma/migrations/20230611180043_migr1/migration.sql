-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `surname` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `age` INTEGER NULL,
    `course` VARCHAR(191) NOT NULL,
    `course_format` VARCHAR(191) NOT NULL,
    `course_type` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NULL,
    `sum` INTEGER NULL,
    `alreadyPaid` INTEGER NULL,
    `group` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `utm` VARCHAR(191) NULL,
    `msg` VARCHAR(191) NULL,
    `manager` VARCHAR(191) NULL,

    UNIQUE INDEX `orders_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
