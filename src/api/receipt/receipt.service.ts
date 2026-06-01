import prisma from "../../utils/prisma.js";

export class ReceiptServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const parseMoney = (value?: unknown) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

class ReceiptService {
  async getReceiptByAppointmentID(appointmentID: string) {
    const [appointment, examineFeeConfig] = await Promise.all([
      prisma.appointment.findUnique({
        where: { appointmentID },
        select: {
          appointmentID: true,
          appointmentDisplayID: true,
          scheduleDate: true,
          patient: {
            select: {
              account: {
                select: {
                  DisplayID: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          enterTickets: {
            select: {
              examineLogs: {
                select: {
                  prescription: {
                    select: {
                      prescriptionID: true,
                      prescriptionDisplayID: true,
                      payAmount: true,
                      status: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.systemConfig.findUnique({
        where: { key: "COUNT_FEE" },
        select: { value: true },
      }),
    ]);


    if (!appointment) {
      throw new ReceiptServiceError("Appointment not found", 404);
    }

    if (!examineFeeConfig) {
      throw new ReceiptServiceError("System config COUNT_FEE not found", 404);
    }

    const prescriptions = appointment.enterTickets.flatMap((ticket) =>
      ticket.examineLogs.flatMap((log) =>
        log.prescription?.status === "done" ? [log.prescription] : []
      )
    );

    const prescriptionFee = prescriptions.reduce(
      (total, prescription) => total + parseMoney(prescription.payAmount?.toNumber()),
      0
    );
    const examineFee = parseMoney(examineFeeConfig.value);

    const patientName = `${appointment.patient.account.lastName} ${appointment.patient.account.firstName}`.trim();

    return {
      appointmentID: appointment.appointmentID,
      appointmentDisplayID: appointment.appointmentDisplayID,
      patientDisplayID: appointment.patient.account.DisplayID,
      patientName,
      appointmentDate: appointment.scheduleDate,
      examineFee,
      prescriptionFee: prescriptions.length > 0 ? prescriptionFee : null,
      totalFee: examineFee + prescriptionFee,
      prescriptions: prescriptions.map((prescription) => ({
        prescriptionID: prescription.prescriptionID,
        prescriptionDisplayID: prescription.prescriptionDisplayID,
        payAmount: parseMoney(prescription.payAmount?.toNumber()),
      })),
    };
  }

  async getReceiptByPrescriptionID(prescriptionID: string) {
    const [prescription, examineFeeConfig] = await Promise.all([
      prisma.prescription.findUnique({
        where: { prescriptionID },
        select: {
          prescriptionID: true,
          prescriptionDisplayID: true,
          payAmount: true,
          status: true,
          details: {
            select: {
              quantity: true,
              medicine: {
                select: {
                  medicineID: true,
                  medicineName: true,
                  description: true,
                  price: true,
                  quantity: true,
                  unit: {
                    select: {
                      unitName: true,
                    },
                  },
                },
              },
            },
          },
          examine: {
            select: {
              enterTicket: {
                select: {
                  appointment: {
                    select: {
                      appointmentID: true,
                      appointmentDisplayID: true,
                      scheduleDate: true,
                      patient: {
                        select: {
                          account: {
                            select: {
                              DisplayID: true,
                              firstName: true,
                              lastName: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.systemConfig.findUnique({
        where: { key: "COUNT_FEE" },
        select: { value: true },
      }),
    ]);

    if (!prescription) {
      throw new ReceiptServiceError("Prescription not found", 404);
    }

    if (!examineFeeConfig) {
      throw new ReceiptServiceError("System config COUNT_FEE not found", 404);
    }

    const appointment = prescription.examine.enterTicket.appointment;
    const examineFee = parseMoney(examineFeeConfig.value);
    const isDonePrescription = prescription.status === "done";
    const prescriptionFee = isDonePrescription ? parseMoney(prescription.payAmount?.toNumber()) : null;
    const patientName = `${appointment.patient.account.lastName} ${appointment.patient.account.firstName}`.trim();
    const enoughMedicines = prescription.details.filter(
      (detail) => detail.medicine.quantity >= detail.quantity
    );

    return {
      appointmentID: appointment.appointmentID,
      appointmentDisplayID: appointment.appointmentDisplayID,
      patientDisplayID: appointment.patient.account.DisplayID,
      patientName,
      appointmentDate: appointment.scheduleDate,
      examineFee,
      prescriptionFee,
      totalFee: examineFee + (prescriptionFee ?? 0),
      prescriptions: isDonePrescription
        ? [
            {
              prescriptionID: prescription.prescriptionID,
              prescriptionDisplayID: prescription.prescriptionDisplayID,
              payAmount: parseMoney(prescription.payAmount?.toNumber()),
            },
          ]
        : [],
      medicines: enoughMedicines.map((detail) => ({
        medicineID: detail.medicine.medicineID,
        medicineName: detail.medicine.medicineName,
        description: detail.medicine.description,
        price: parseMoney(detail.medicine.price?.toNumber()),
        quantity: detail.quantity,
        unitName: detail.medicine.unit.unitName,
      })),
    };
  }
}

export default new ReceiptService();
