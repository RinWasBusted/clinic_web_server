-- CreateEnum
CREATE TYPE "AccountRole" AS ENUM ('root', 'staff', 'doctor', 'manager', 'patient', 'pharmacist');

-- CreateEnum
CREATE TYPE "BloodType" AS ENUM ('a', 'o', 'b', 'ab');

-- CreateEnum
CREATE TYPE "FacultyName" AS ENUM ('CARDIOLOGY', 'GASTROENTEROLOGY', 'PULMONOLOGY', 'NEUROLOGY', 'ORTHOPEDICS');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('examination', 'pharmacy', 'cashier', 'lab');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('pending', 'approved', 'cancelled');

-- CreateEnum
CREATE TYPE "DepositStatus" AS ENUM ('paid', 'unpaid', 'refunded');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('examine', 're_examine');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('pending', 'in_check', 'skip', 'done');

-- CreateEnum
CREATE TYPE "ExamineStatus" AS ENUM ('draft', 'done');

-- CreateEnum
CREATE TYPE "MedicineUnit" AS ENUM ('bottle', 'capsule', 'patches');

-- CreateEnum
CREATE TYPE "MedicineTicketStatus" AS ENUM ('pending', 'done');

-- CreateEnum
CREATE TYPE "ImexType" AS ENUM ('export', 'import');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('unpaid', 'paid');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'qr');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('examine', 'medicine', 'test');

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" SERIAL NOT NULL,
    "user_id_id" UUID,
    "hashedToken" VARCHAR NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "expire_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "accountID" UUID NOT NULL DEFAULT gen_random_uuid(),
    "role" "AccountRole" NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(75) NOT NULL,
    "password" VARCHAR(100),
    "email" VARCHAR(254) NOT NULL,
    "phoneNumber" VARCHAR(12),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "birthDate" DATE NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("accountID")
);

-- CreateTable
CREATE TABLE "Patient" (
    "patientID" UUID NOT NULL,
    "height" INTEGER,
    "weight" INTEGER,
    "blood" "BloodType",
    "sequence" BIGINT,
    "patientDisplayID" BIGINT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("patientID")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "doctorID" UUID NOT NULL,
    "startDate" DATE NOT NULL,
    "sequence" BIGINT,
    "doctorDisplayID" BIGINT,
    "fromFaculty" UUID,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("doctorID")
);

-- CreateTable
CREATE TABLE "Staff" (
    "staffID" UUID NOT NULL,
    "startDate" DATE NOT NULL,
    "sequence" BIGINT,
    "staffDisplayID" BIGINT,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("staffID")
);

-- CreateTable
CREATE TABLE "Pharmacist" (
    "pharmacistID" UUID NOT NULL,
    "startDate" DATE NOT NULL,
    "sequence" BIGINT,
    "pharmacistDisplayID" BIGINT,

    CONSTRAINT "Pharmacist_pkey" PRIMARY KEY ("pharmacistID")
);

-- CreateTable
CREATE TABLE "Root" (
    "rootID" UUID NOT NULL,
    "note" VARCHAR(255),

    CONSTRAINT "Root_pkey" PRIMARY KEY ("rootID")
);

-- CreateTable
CREATE TABLE "Faculty" (
    "facultyID" UUID NOT NULL DEFAULT gen_random_uuid(),
    "facultyName" TEXT NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("facultyID")
);

-- CreateTable
CREATE TABLE "Room" (
    "roomID" UUID NOT NULL DEFAULT gen_random_uuid(),
    "roomType" "RoomType" NOT NULL,
    "roomName" VARCHAR(10),
    "FacultyID" UUID,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("roomID")
);

-- CreateTable
CREATE TABLE "Timetable" (
    "timeID" UUID NOT NULL DEFAULT gen_random_uuid(),
    "doctorID" UUID NOT NULL,
    "roomID" UUID NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "note" VARCHAR(255),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Timetable_pkey" PRIMARY KEY ("timeID")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "appointmentID" UUID NOT NULL DEFAULT gen_random_uuid(),
    "appointmentDisplayID" VARCHAR(6) NOT NULL,
    "appointmentType" "AppointmentType" NOT NULL DEFAULT 'examine',
    "scheduleDate" DATE NOT NULL,
    "roomID" UUID,
    "patientID" UUID NOT NULL,
    "facultyID" UUID NOT NULL,
    "approvedBy" UUID,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'pending',
    "depositStatus" "DepositStatus" NOT NULL DEFAULT 'unpaid',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "doctorID" UUID,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("appointmentID")
);

-- CreateTable
CREATE TABLE "EnterTicket" (
    "ticketID" UUID NOT NULL DEFAULT gen_random_uuid(),
    "orderNum" INTEGER NOT NULL,
    "appointmentID" UUID NOT NULL,
    "patientID" UUID NOT NULL,
    "roomID" UUID NOT NULL,
    "checkIn" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "TicketStatus" NOT NULL DEFAULT 'pending',
    "note" VARCHAR(255),

    CONSTRAINT "EnterTicket_pkey" PRIMARY KEY ("ticketID")
);

-- CreateTable
CREATE TABLE "Disease" (
    "diseaseID" VARCHAR(5) NOT NULL,
    "diseaseName" VARCHAR(255) NOT NULL,
    "note" VARCHAR(255),

    CONSTRAINT "Disease_pkey" PRIMARY KEY ("diseaseID")
);

-- CreateTable
CREATE TABLE "ExamineLog" (
    "examineID" UUID NOT NULL DEFAULT gen_random_uuid(),
    "appointmentID" UUID NOT NULL,
    "patientID" UUID NOT NULL,
    "symptoms" VARCHAR(255) NOT NULL,
    "examinedBy" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ExamineStatus" NOT NULL DEFAULT 'draft',
    "sequence" BIGINT,
    "examineDisplayID" BIGINT,
    "note" VARCHAR(255),

    CONSTRAINT "ExamineLog_pkey" PRIMARY KEY ("examineID")
);

-- CreateTable
CREATE TABLE "ExamineLogDetails" (
    "examineID" UUID NOT NULL,
    "diseaseID" VARCHAR(5) NOT NULL,
    "note" VARCHAR(255),

    CONSTRAINT "ExamineLogDetails_pkey" PRIMARY KEY ("examineID","diseaseID")
);

-- CreateTable
CREATE TABLE "Test" (
    "serviceID" VARCHAR(5) NOT NULL,
    "price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "testName" VARCHAR(255) NOT NULL,
    "note" VARCHAR(255),

    CONSTRAINT "Test_pkey" PRIMARY KEY ("serviceID")
);

-- CreateTable
CREATE TABLE "TestLog" (
    "testID" UUID NOT NULL DEFAULT gen_random_uuid(),
    "examineID" UUID NOT NULL,
    "patientID" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" VARCHAR(255),

    CONSTRAINT "TestLog_pkey" PRIMARY KEY ("testID")
);

-- CreateTable
CREATE TABLE "TestDetails" (
    "testID" UUID NOT NULL,
    "serviceID" VARCHAR(5) NOT NULL,

    CONSTRAINT "TestDetails_pkey" PRIMARY KEY ("testID","serviceID")
);

-- CreateTable
CREATE TABLE "Medicine" (
    "medicineID" SERIAL NOT NULL,
    "medicineName" VARCHAR(255) NOT NULL,
    "medicineImage" VARCHAR(255),
    "unit" "MedicineUnit" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("medicineID")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "prescriptionID" UUID NOT NULL DEFAULT gen_random_uuid(),
    "examineID" UUID NOT NULL,
    "doctorID" UUID NOT NULL,
    "pharmacistID" UUID,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payAmount" DECIMAL(12,2) DEFAULT 0,
    "note" VARCHAR(255),

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("prescriptionID")
);

-- CreateTable
CREATE TABLE "PrescriptionDetails" (
    "prescriptionID" UUID NOT NULL,
    "medicineID" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "usage" VARCHAR(255),
    "note" VARCHAR(255),

    CONSTRAINT "PrescriptionDetails_pkey" PRIMARY KEY ("prescriptionID","medicineID")
);

-- CreateTable
CREATE TABLE "MedicineTicket" (
    "ticketID" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prescriptionID" UUID NOT NULL,
    "orderNum" INTEGER NOT NULL,
    "roomID" UUID NOT NULL,
    "status" "MedicineTicketStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" VARCHAR(255),

    CONSTRAINT "MedicineTicket_pkey" PRIMARY KEY ("ticketID")
);

-- CreateTable
CREATE TABLE "ImexMedicineLog" (
    "imexID" UUID NOT NULL DEFAULT gen_random_uuid(),
    "imexType" "ImexType" NOT NULL,
    "pharmacistID" UUID NOT NULL,
    "value" DECIMAL(12,2) DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" VARCHAR(255),

    CONSTRAINT "ImexMedicineLog_pkey" PRIMARY KEY ("imexID")
);

-- CreateTable
CREATE TABLE "ImexMedicineDetails" (
    "imexID" UUID NOT NULL,
    "medicineID" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "note" VARCHAR(255),

    CONSTRAINT "ImexMedicineDetails_pkey" PRIMARY KEY ("imexID","medicineID")
);

-- CreateTable
CREATE TABLE "PaymentHistory" (
    "paymentID" UUID NOT NULL DEFAULT gen_random_uuid(),
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paymentAmount" DECIMAL(12,2) DEFAULT 0,
    "patientID" UUID NOT NULL,
    "roomID" UUID,
    "status" "PaymentStatus" NOT NULL DEFAULT 'unpaid',
    "service" "ServiceType" NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY ("paymentID")
);

-- CreateTable
CREATE TABLE "MedicineMonthReport" (
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "medicineID" INTEGER NOT NULL,
    "useCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MedicineMonthReport_pkey" PRIMARY KEY ("year","month","medicineID")
);

-- CreateTable
CREATE TABLE "PaymentMonthReport" (
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "date" INTEGER NOT NULL,
    "patientCount" INTEGER DEFAULT 0,
    "revenue" DECIMAL(22,2) DEFAULT 0,

    CONSTRAINT "PaymentMonthReport_pkey" PRIMARY KEY ("year","month","date")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_hashed_token_idx" ON "refresh_tokens"("hashedToken");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id_id");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_patientDisplayID_key" ON "Patient"("patientDisplayID");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_doctorDisplayID_key" ON "Doctor"("doctorDisplayID");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_staffDisplayID_key" ON "Staff"("staffDisplayID");

-- CreateIndex
CREATE UNIQUE INDEX "Pharmacist_pharmacistDisplayID_key" ON "Pharmacist"("pharmacistDisplayID");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_facultyName_key" ON "Faculty"("facultyName");

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomType_key" ON "Room"("roomType");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_appointmentDisplayID_key" ON "Appointment"("appointmentDisplayID");

-- CreateIndex
CREATE UNIQUE INDEX "ExamineLog_examineDisplayID_key" ON "ExamineLog"("examineDisplayID");

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_medicineName_key" ON "Medicine"("medicineName");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_id_user_id_fk" FOREIGN KEY ("user_id_id") REFERENCES "Account"("accountID") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_patientID_fkey" FOREIGN KEY ("patientID") REFERENCES "Account"("accountID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_doctorID_fkey" FOREIGN KEY ("doctorID") REFERENCES "Account"("accountID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_fromFaculty_fkey" FOREIGN KEY ("fromFaculty") REFERENCES "Faculty"("facultyID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_staffID_fkey" FOREIGN KEY ("staffID") REFERENCES "Account"("accountID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pharmacist" ADD CONSTRAINT "Pharmacist_pharmacistID_fkey" FOREIGN KEY ("pharmacistID") REFERENCES "Account"("accountID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Root" ADD CONSTRAINT "Root_rootID_fkey" FOREIGN KEY ("rootID") REFERENCES "Account"("accountID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_FacultyID_fkey" FOREIGN KEY ("FacultyID") REFERENCES "Faculty"("facultyID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timetable" ADD CONSTRAINT "Timetable_doctorID_fkey" FOREIGN KEY ("doctorID") REFERENCES "Doctor"("doctorID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timetable" ADD CONSTRAINT "Timetable_roomID_fkey" FOREIGN KEY ("roomID") REFERENCES "Room"("roomID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_roomID_fkey" FOREIGN KEY ("roomID") REFERENCES "Room"("roomID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientID_fkey" FOREIGN KEY ("patientID") REFERENCES "Patient"("patientID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_facultyID_fkey" FOREIGN KEY ("facultyID") REFERENCES "Faculty"("facultyID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "Staff"("staffID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorID_fkey" FOREIGN KEY ("doctorID") REFERENCES "Doctor"("doctorID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnterTicket" ADD CONSTRAINT "EnterTicket_appointmentID_fkey" FOREIGN KEY ("appointmentID") REFERENCES "Appointment"("appointmentID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnterTicket" ADD CONSTRAINT "EnterTicket_patientID_fkey" FOREIGN KEY ("patientID") REFERENCES "Patient"("patientID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnterTicket" ADD CONSTRAINT "EnterTicket_roomID_fkey" FOREIGN KEY ("roomID") REFERENCES "Room"("roomID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamineLog" ADD CONSTRAINT "ExamineLog_appointmentID_fkey" FOREIGN KEY ("appointmentID") REFERENCES "Appointment"("appointmentID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamineLog" ADD CONSTRAINT "ExamineLog_patientID_fkey" FOREIGN KEY ("patientID") REFERENCES "Patient"("patientID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamineLog" ADD CONSTRAINT "ExamineLog_examinedBy_fkey" FOREIGN KEY ("examinedBy") REFERENCES "Doctor"("doctorID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamineLogDetails" ADD CONSTRAINT "ExamineLogDetails_examineID_fkey" FOREIGN KEY ("examineID") REFERENCES "ExamineLog"("examineID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamineLogDetails" ADD CONSTRAINT "ExamineLogDetails_diseaseID_fkey" FOREIGN KEY ("diseaseID") REFERENCES "Disease"("diseaseID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestLog" ADD CONSTRAINT "TestLog_examineID_fkey" FOREIGN KEY ("examineID") REFERENCES "ExamineLog"("examineID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestLog" ADD CONSTRAINT "TestLog_patientID_fkey" FOREIGN KEY ("patientID") REFERENCES "Patient"("patientID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestDetails" ADD CONSTRAINT "TestDetails_testID_fkey" FOREIGN KEY ("testID") REFERENCES "TestLog"("testID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestDetails" ADD CONSTRAINT "TestDetails_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Test"("serviceID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_examineID_fkey" FOREIGN KEY ("examineID") REFERENCES "ExamineLog"("examineID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_doctorID_fkey" FOREIGN KEY ("doctorID") REFERENCES "Doctor"("doctorID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_pharmacistID_fkey" FOREIGN KEY ("pharmacistID") REFERENCES "Pharmacist"("pharmacistID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionDetails" ADD CONSTRAINT "PrescriptionDetails_prescriptionID_fkey" FOREIGN KEY ("prescriptionID") REFERENCES "Prescription"("prescriptionID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionDetails" ADD CONSTRAINT "PrescriptionDetails_medicineID_fkey" FOREIGN KEY ("medicineID") REFERENCES "Medicine"("medicineID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineTicket" ADD CONSTRAINT "MedicineTicket_prescriptionID_fkey" FOREIGN KEY ("prescriptionID") REFERENCES "Prescription"("prescriptionID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineTicket" ADD CONSTRAINT "MedicineTicket_roomID_fkey" FOREIGN KEY ("roomID") REFERENCES "Room"("roomID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImexMedicineLog" ADD CONSTRAINT "ImexMedicineLog_pharmacistID_fkey" FOREIGN KEY ("pharmacistID") REFERENCES "Pharmacist"("pharmacistID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImexMedicineDetails" ADD CONSTRAINT "ImexMedicineDetails_imexID_fkey" FOREIGN KEY ("imexID") REFERENCES "ImexMedicineLog"("imexID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImexMedicineDetails" ADD CONSTRAINT "ImexMedicineDetails_medicineID_fkey" FOREIGN KEY ("medicineID") REFERENCES "Medicine"("medicineID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentHistory" ADD CONSTRAINT "PaymentHistory_patientID_fkey" FOREIGN KEY ("patientID") REFERENCES "Patient"("patientID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentHistory" ADD CONSTRAINT "PaymentHistory_roomID_fkey" FOREIGN KEY ("roomID") REFERENCES "Room"("roomID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineMonthReport" ADD CONSTRAINT "MedicineMonthReport_medicineID_fkey" FOREIGN KEY ("medicineID") REFERENCES "Medicine"("medicineID") ON DELETE CASCADE ON UPDATE CASCADE;
-- logic tạo account và bảng role cùng lúc
CREATE OR REPLACE FUNCTION public.ensure_role_profile_row()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- INSERT: tạo profile theo role
  IF (TG_OP = 'INSERT') THEN
    IF NEW.role = 'patient' THEN
      INSERT INTO "Patient" ("patientID")
      VALUES (NEW."accountID")
      ON CONFLICT ("patientID") DO NOTHING;

    ELSIF NEW.role = 'doctor' THEN
      INSERT INTO "Doctor" ("doctorID")
      VALUES (NEW."accountID")
      ON CONFLICT ("doctorID") DO NOTHING;

    ELSIF NEW.role = 'staff' THEN
      INSERT INTO "Staff" ("staffID")
      VALUES (NEW."accountID")
      ON CONFLICT ("staffID") DO NOTHING;

    ELSIF NEW.role = 'pharmacist' THEN
      INSERT INTO "Pharmacist" ("pharmacistID")
      VALUES (NEW."accountID")
      ON CONFLICT ("pharmacistID") DO NOTHING;

    ELSIF NEW.role = 'manager' THEN
      INSERT INTO "Manager" ("managerID")
      VALUES (NEW."accountID")
      ON CONFLICT ("managerID") DO NOTHING;
    END IF;

    RETURN NEW;
  END IF;

  -- UPDATE: nếu đổi role thì xóa profile cũ và tạo profile mới
  IF (TG_OP = 'UPDATE' AND NEW.role IS DISTINCT FROM OLD.role) THEN

    -- XÓA profile theo role cũ
    IF OLD.role = 'patient' THEN
      DELETE FROM "Patient" WHERE "patientID" = NEW."accountID";

    ELSIF OLD.role = 'doctor' THEN
      DELETE FROM "Doctor" WHERE "doctorID" = NEW."accountID";

    ELSIF OLD.role = 'staff' THEN
      DELETE FROM "Staff" WHERE "staffID" = NEW."accountID";

    ELSIF OLD.role = 'pharmacist' THEN
      DELETE FROM "Pharmacist" WHERE "pharmacistID" = NEW."accountID";

    ELSIF OLD.role = 'manager' THEN
      DELETE FROM "Manager" WHERE "managerID" = NEW."accountID";
    END IF;

    -- TẠO profile theo role mới
    IF NEW.role = 'patient' THEN
      INSERT INTO "Patient" ("patientID")
      VALUES (NEW."accountID")
      ON CONFLICT ("patientID") DO NOTHING;

    ELSIF NEW.role = 'doctor' THEN
      INSERT INTO "Doctor" ("doctorID")
      VALUES (NEW."accountID")
      ON CONFLICT ("doctorID") DO NOTHING;

    ELSIF NEW.role = 'staff' THEN
      INSERT INTO "Staff" ("staffID")
      VALUES (NEW."accountID")
      ON CONFLICT ("staffID") DO NOTHING;

    ELSIF NEW.role = 'pharmacist' THEN
      INSERT INTO "Pharmacist" ("pharmacistID")
      VALUES (NEW."accountID")
      ON CONFLICT ("pharmacistID") DO NOTHING;

    ELSIF NEW.role = 'manager' THEN
      INSERT INTO "Manager" ("managerID")
      VALUES (NEW."accountID")
      ON CONFLICT ("managerID") DO NOTHING;
    END IF;

    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ensure_role_profile_row ON "Account";

CREATE TRIGGER trg_ensure_role_profile_row
AFTER INSERT OR UPDATE OF role ON "Account"
FOR EACH ROW
EXECUTE FUNCTION public.ensure_role_profile_row();