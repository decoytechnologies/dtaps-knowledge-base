-- DropIndex
DROP INDEX "public"."Module_name_key";

-- AlterTable
ALTER TABLE "public"."Module" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Module" ADD CONSTRAINT "Module_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;
