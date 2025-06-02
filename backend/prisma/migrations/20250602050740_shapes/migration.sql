-- CreateTable
CREATE TABLE "Shapes" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "shape" JSONB NOT NULL,

    CONSTRAINT "Shapes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Shapes" ADD CONSTRAINT "Shapes_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
