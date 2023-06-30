-- DropIndex
DROP INDEX `MsgIndex` ON `Orders`;

-- DropIndex
DROP INDEX `UtmIndex` ON `Orders`;

-- AlterTable
ALTER TABLE `Orders` ADD COLUMN `manager` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `ManagerIndex` ON `Orders`(`manager`);
