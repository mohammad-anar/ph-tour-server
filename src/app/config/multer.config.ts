import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
import CloudinaryStorage from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import { Request } from "express";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req: Request, file:any) => {
      // my image.png => 234343dfds.e342434343.my-image.png

      //   console.log({ file });

      //   const extension = file.originalname.split(".").pop();

      const fileName = file.originalname
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/\./g, "-")
        // eslint-disable-next-line no-useless-escape
        .replace(/[^a-z0-9\-\.]/g, "");

      const uniqueFileName =
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        fileName;

      return uniqueFileName;
    },
  },
});

export const multerUpload = multer({ storage: storage });
