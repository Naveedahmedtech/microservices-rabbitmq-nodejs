-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "username" TEXT,
    "image" TEXT,
    "role" TEXT DEFAULT 'USER',
    "signup_type" TEXT NOT NULL,
    "full_name" TEXT,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isBlock" BOOLEAN DEFAULT false,
    "isActivated" BOOLEAN DEFAULT true,
    "deletedAT" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
