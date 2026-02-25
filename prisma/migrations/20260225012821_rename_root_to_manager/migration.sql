/*
  Warnings:

  - You are about to drop the `Root` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Root" DROP CONSTRAINT "Root_ManagerID_fkey";

-- DropTable
DROP TABLE "Root";

-- CreateTable
CREATE TABLE "Manager" (
    "managerID" UUID NOT NULL,
    "note" VARCHAR(255),

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("managerID")
);

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_ManagerID_fkey" FOREIGN KEY ("managerID") REFERENCES "Account"("accountID") ON DELETE CASCADE ON UPDATE CASCADE;
