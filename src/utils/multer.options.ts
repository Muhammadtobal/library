import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';

const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

export function uploadImage(folderName: string, filePrefix: string) {
  return {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = `./uploads/${folderName}`;

        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${filePrefix}-${uniqueSuffix}${ext}`);
      },
    }),

    fileFilter: (req, file, cb) => {
      const ext = extname(file.originalname).toLowerCase();

      if (!allowedImageExtensions.includes(ext)) {
        return cb(new BadRequestException('Only image files are allowed! (jpg, jpeg, png, gif)'), false);
      }

      cb(null, true);
    },
  };
}
