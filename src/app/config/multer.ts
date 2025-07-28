import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      const fileName = file.originalname
        .toLowerCase()
        .replace(/\s+/g, "-") //Empty space replace dash,
        .replace(/\./g, "-")
        .replace(/[^a-zA-Z0-9]/g, ""); // non alpa neumeric regx

      const extension = file.originalname.split(".").pop();
      const uniqueName =
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        fileName +
        "." +
        extension;

      return uniqueName;
    },
  },
});

export const MulterUpload = multer({ storage: storage });
