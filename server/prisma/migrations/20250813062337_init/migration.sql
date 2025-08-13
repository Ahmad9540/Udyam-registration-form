-- CreateTable
CREATE TABLE "public"."Submission" (
    "id" SERIAL NOT NULL,
    "aadhaarNumber" TEXT NOT NULL,
    "panNumber" TEXT,
    "pincode" TEXT,
    "city" TEXT,
    "state" TEXT,
    "otpVerified" BOOLEAN NOT NULL DEFAULT false,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);
