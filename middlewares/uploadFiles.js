import multer from "multer";
import fs from 'fs';
import path from 'path';

export const uploadFile =
  multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const dir = path.resolve('./uploads');
        fs.exists(dir, (exist) => {
          if (!exist) {
            return fs.mkdir(dir, (error) => cb(error, dir));
          }
          return cb(null, dir);
        });
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '_' + file.originalname)
      },
    }),
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
  });
