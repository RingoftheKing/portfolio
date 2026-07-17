import multer from "multer";
import { generateFilePath, slugify } from "../fileUtils.js";
import fs from "fs";
import path from "path";

type NamespaceMap = Record<string, string>; // known to be a string: string map, Record is sufficient.

export const THUMBNAIL_SAVE_LOC = 'uploads/thumbnails';

export function createStorage(namespaceMap: NamespaceMap) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const namespace = namespaceMap[file.fieldname];
      // make the directory if it doesn't exist
      const dir = path.join(process.cwd(), namespace || 'uploads/');
      fs.mkdirSync(dir, { recursive: true });
      cb(null, namespace || 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, slugify(file) || file.originalname);
    },
  });
}

// Limit file size to 5MB
// for single just append single when importing this middleware
export const upload = multer({ storage: createStorage({
  thumbnail_file: THUMBNAIL_SAVE_LOC,
  showcase_files: 'uploads/showcase_images',
}), limits: { fileSize: 5 * 1024 * 1024 } }); 