import multer from "multer";
import { Request } from "express";
import { allowedFileTypes } from "../types/file/upload";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req : Request, file : Express.Multer.File, cb : multer.FileFilterCallback) => {
    const allowedTypes = allowedFileTypes;

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unallowed file type!'));
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: fileFilter
});

export default upload;
