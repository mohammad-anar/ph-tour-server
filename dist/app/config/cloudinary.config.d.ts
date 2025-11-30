import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
export declare const cloudinaryUpload: typeof cloudinary;
export declare const uploadBufferToCloudinary: (buffer: Buffer, fileName: string) => Promise<UploadApiResponse | undefined>;
export declare const deleteImageFromCloudinary: (url: string) => Promise<void>;
//# sourceMappingURL=cloudinary.config.d.ts.map