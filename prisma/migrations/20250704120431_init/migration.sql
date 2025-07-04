-- CreateTable
CREATE TABLE "User" (
    "regId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "handle" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("regId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_handle_key" ON "User"("handle");
