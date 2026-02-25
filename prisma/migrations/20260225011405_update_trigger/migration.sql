/*
  Warnings:

  - The primary key for the `Root` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `rootID` on the `Root` table. All the data in the column will be lost.
  - Added the required column `ManagerID` to the `Root` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Root" DROP CONSTRAINT "Root_rootID_fkey";

-- AlterTable
ALTER TABLE "Root" DROP CONSTRAINT "Root_pkey",
DROP COLUMN "rootID",
ADD COLUMN     "ManagerID" UUID NOT NULL,
ADD CONSTRAINT "Root_pkey" PRIMARY KEY ("ManagerID");

-- AddForeignKey
ALTER TABLE "Root" ADD CONSTRAINT "Root_ManagerID_fkey" FOREIGN KEY ("ManagerID") REFERENCES "Account"("accountID") ON DELETE CASCADE ON UPDATE CASCADE;
