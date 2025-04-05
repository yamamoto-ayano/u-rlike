/*
  Warnings:

  - Added the required column `memo` to the `Edges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Edges" ADD COLUMN     "memo" TEXT NOT NULL;
