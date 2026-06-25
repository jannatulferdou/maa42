-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profileImage" TEXT,
    "dateOfBirth" TEXT,
    "age" INTEGER,
    "gender" TEXT,
    "bloodGroup" TEXT,
    "childbirthDate" TEXT,
    "deliveryType" TEXT,
    "postpartumDay" INTEGER,
    "previousComplications" TEXT,
    "existingHealthConditions" TEXT,
    "currentMedicines" TEXT,
    "doctor" TEXT,
    "clinic" TEXT,
    "emergencyContact" TEXT,
    "role" TEXT NOT NULL DEFAULT 'mother',
    "shareWithDoctor" BOOLEAN NOT NULL DEFAULT true,
    "emergencyAccess" BOOLEAN NOT NULL DEFAULT true,
    "offlineSync" BOOLEAN NOT NULL DEFAULT true,
    "chatHistoryEnabled" BOOLEAN NOT NULL DEFAULT true,
    "analyticsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "type" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthCheckin" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "symptoms" TEXT[],
    "severity" TEXT NOT NULL,
    "notes" TEXT,
    "risk" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "nextSteps" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthCheckin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthCheckin" ADD CONSTRAINT "HealthCheckin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
