import { v2 as cloudinary } from "cloudinary";
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("Cloudinary config missing! Check .env file.");
}
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});
export default cloudinary;
export const uploadBufferToCloudinary = (buffer, options = {}) => new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) {
            reject(error);
            return;
        }
        if (!result) {
            reject(new Error("Upload failed"));
            return;
        }
        resolve(result);
    });
    stream.end(buffer);
});
//# sourceMappingURL=cloudinary.js.map