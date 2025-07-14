// upload-image.ts
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import * as multer from 'multer';

const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf'];

export function uploadImageMemory() {
  return {
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
      const ext = extname(file.originalname).toLowerCase();
      if (!allowedImageExtensions.includes(ext)) {
        return cb(
          new BadRequestException('Only image files are allowed!'),
          false,
        );
      }
      cb(null, true);
    },
  };
}
// helper function
import * as fs from 'fs';

export function saveImageManually(
  folder: string,
  prefix: string,
  file: Express.Multer.File,
): string {
  const ext = extname(file.originalname).toLowerCase();
  const filename = `${prefix}-${Date.now()}${ext}`;
  const uploadPath = `./uploads/${folder}`;

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  fs.writeFileSync(`${uploadPath}/${filename}`, file.buffer);
  return filename;
}
export function saveFileManually(
  folder: string,
  prefix: string,
  file: Express.Multer.File,
): string {
  const ext = extname(file.originalname).toLowerCase();
  const filename = `${prefix}-${Date.now()}${ext}`;
  const uploadPath = `./uploads/${folder}`;

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  fs.writeFileSync(`${uploadPath}/${filename}`, file.buffer);
  return filename;
}
