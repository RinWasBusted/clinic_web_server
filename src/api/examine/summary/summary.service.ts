import prisma from "../../../utils/prisma.js";
import { NotFoundError } from "../../admin/appointment/appointment.service.js";
import prescriptionService from "../prescription/prescription.service.js";
import ExamineLogService from "./../log/log.service.js";

const fullNameProjection = {
  account: {
    select: {
      fullName: true,
    },
  },
};

const patientProjection = {
  account: {
    select: {
      fullName: true,
      genderDisplay: true,
      age: true,
      DisplayID: true,
      address: true,
    },
  },
};

const diseaseProjection = {
  select: {
    disease: {
      select: {
        diseaseID: true,
        diseaseName: true,
      },
    },
  },
};

const prescriptionDetailProjection = {
  payAmount: true,
  prescriptionDisplayID: true,
  details: {
    where: {
      medicine: {
        quantity: {
          gt: 50, // Hardcode area. Will change to status enum later!
        },
      },
    },
    select: {
      quantity: true,
      usage: true,
      note: true,
      medicine: {
        select: { medicineName: true },
      },
    },
  },
  needReExamine: true,
  totalTreatmentDays: true,
};

export async function getPrintableVersion(id: string) {
  // Change to displayID (human-readable code)
  const examine = await prisma.examineLog.findFirst({ where: { examineDisplayID: id }, select: { examineID: true } });
  if (!examine) throw new NotFoundError("Phiếu khám không hợp lệ!");
  const uuid = examine.examineID;
  const _ = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`update "Prescription"
      set "payAmount" = (select COALESCE(sum(m.price*dt.quantity), 0)
      from "PrescriptionDetails" as dt 
      inner join "Medicine" as m 
      on m."medicineID" = dt."medicineID"
      where  
        dt."prescriptionID" =
        (select ("prescriptionID") from "Prescription" where "examineID" = ${uuid})
      and 
        m.quantity > 50)
      where "prescriptionID" =
        (select ("prescriptionID") from "Prescription" where "examineID" = ${uuid})
    `;

    const log = await tx.examineLog.findUnique({
      where: { examineID: uuid },
      select: {
        createdAtLocal: true,
        patient: {
          select: { ...patientProjection },
        },
        doctor: fullNameProjection.account,
        details: diseaseProjection,
        prescription: {
          select: prescriptionDetailProjection,
        },
      },
    });
    return log;
  });
  return _;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createNewRecord(payload: any) {
  const { examine, prescription: prescriptionWithNoExamineLog } = payload;

  // Refactored code:
  const finalResult = await prisma.$transaction(async (tx) => {
    const newExamineLog = await ExamineLogService.submit(examine, tx);
    const { examineID, examineDisplayID, patientID } = newExamineLog;

    const prescriptionData = await prescriptionService.refinePrescriptionData(
      {
        ...prescriptionWithNoExamineLog,
        examineID: examineID as string,
      },
      tx
    );
    const newPrescription = await prescriptionService.submit(
      {
        ...prescriptionData,
        doctorID: prescriptionWithNoExamineLog.doctorID!,
        examineDisplayID: examineDisplayID as string,
        patientID: patientID as string,
      },
      tx
    );
    return {
      examine: newExamineLog,
      prescription: newPrescription,
    };
  });

  return finalResult;
}
