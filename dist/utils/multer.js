import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";
const storage = new CloudinaryStorage({
    cloudinary,
    params: async () => ({
        folder: "clinic",
        resource_type: "image",
    }),
});
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only image files are allowed"));
            return;
        }
        cb(null, true);
    },
});
export default upload;
//# sourceMappingURL=multer.js.map