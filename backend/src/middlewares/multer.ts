import multer, { Options } from 'multer';

const commonLimits: Options['limits'] = {
  fileSize: 6 * 1024 * 1024, // 6MB
};

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { ...commonLimits },
});

export const imgsUpload = multer({
  storage,
  limits: { ...commonLimits },
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype.startsWith('image/'));
  },
});
