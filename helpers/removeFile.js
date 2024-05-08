// Remove the last image from uploads folder
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

export const removeFile = (filePath) => {
  fs.unlink(path.join(__dirname, `/uploads/${filePath}`), (err) => {
    if (err) {
      console.error(err);
    }
  })
}