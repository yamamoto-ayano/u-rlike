-- CreateTable
CREATE TABLE "Edges" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "folderId" TEXT NOT NULL,

    CONSTRAINT "Edges_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Edges" ADD CONSTRAINT "Edges_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Bookmark"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edges" ADD CONSTRAINT "Edges_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Bookmark"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edges" ADD CONSTRAINT "Edges_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "BookmarkFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
