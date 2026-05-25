import { Prisma } from "@prisma/client/extension";
// import { Prisma } from "../../prisma.js";
const PrescriptionExtension = Prisma.defineExtension({
  name: "prescriptionExtensions",
  query: {
    prescription: {
      async create({ args, query }) {
        // console.log("Prescription is created with args:", JSON.stringify(args.data));
        return query(args);
      },
    },
  },
});
export default PrescriptionExtension;
