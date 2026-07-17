import crypto from 'crypto';

export const DEFAULT_VOLUME_SAVE_LOCATION = 'uploads/';

export function generateFilePath(file: Express.Multer.File | undefined, namespace: string) {
  // this function generate a unique file path for the uploaded file based on the namespace (e.g. Project Name)
  if (!file) {
    // raise custom error
    throw new Error('File is undefined');
  }

  const fileExtension = file.originalname.split('.').pop();
  const uniqueFileName = `${crypto.randomUUID()}.${fileExtension}`;
  return { destination: `${DEFAULT_VOLUME_SAVE_LOCATION}/${namespace}/`, filename: uniqueFileName };
}

export function slugify(file: Express.Multer.File | undefined) : string {
  if (!file) {
    throw new Error('File is undefined');
  }
  const fileExtension = file.originalname.split('.').pop();
  const slugifiedName = file.originalname
    .replace(/\.[^/.]+$/, '') // Remove the file extension
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
  
  return `${slugifiedName}-${crypto.randomUUID()}.${fileExtension}`;
}