import { Prisma } from "@prisma/client/extension";
import { toLocalForAPI } from "../../datetime.js";
// import { Prisma } from "../../prisma.js";
const AllExtension = Prisma.defineExtension({
  name: "allExtensions",
  result: {
    $allModels: {
      createdAtLocal: {
        needs: { createdAt: true },
        compute(model) {
          // Convert createdAt to local time string
          return toLocalForAPI(model.createdAt);
        },
      },
    },
  },
});
export default AllExtension;
