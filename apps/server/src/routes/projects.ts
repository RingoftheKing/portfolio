import { Router, Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { upload } from '../middleware/photoUpload.js';
import fs from 'fs/promises';
import { THUMBNAIL_SAVE_LOC } from '../middleware/photoUpload.js';
import { exec, ExecException } from 'child_process';

// helper function
async function convertHeicToJpeg(path: String): Promise<void> {
  // use ffmpeg locally to convert heic to jpeg
  return new Promise((resolve, reject) => {
    exec(`ffmpeg -i "${path}" "${path.replace(/\.heic$/i, '.jpg')}"`, (error) => {
      if (error) {
        console.error(`Error converting HEIC to JPEG: ${error.message}`);
        reject(error);
      } else {
        // delete the original heic file
        fs.unlink(path as string)
          .then(() => resolve())
          .catch((err: ExecException) => reject(err));
      }
    });
  });
}


const router = Router();

// GET all projects with skills
router.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        skills: true,
      },
    });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET single project by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        skills: true,
      },
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST create new project
interface ProjectUploadedFiles {
  thumbnail_file?: Express.Multer.File[];
  showcase_files?: Express.Multer.File[];
}

router.post('/', 
  upload.fields([
    { name: 'thumbnail_file', maxCount: 1 },
    { name: 'showcase_files', maxCount: 5 },  // accesible via file.fieldname 
  ]),
  async (req: Request, res: Response) => {
  try {
    const conversions : Record<string, string> = {}
    const { name, desc, featured, skills } = req.body;
    
    if (!name || !desc) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    // extract multer files
    const files = req.files as ProjectUploadedFiles;

    // TODO: If HEIC convert to JPEG
    if (files.thumbnail_file && files.thumbnail_file[0].filename.toLowerCase().endsWith('.heic')) {
      // Extra check for security: Ensure file is actually a HEIC file?
      // pass
      // Convert HEIC to JPEG
      const filename = files.thumbnail_file?.[0]?.filename;
      const fullPath = `${THUMBNAIL_SAVE_LOC}/${filename}`;
      await convertHeicToJpeg(fullPath);
      // indicate filename has been converted
      conversions[filename] = filename.replace(/\.heic$/i, '.jpg');
    }

    const thumbnail = files.thumbnail_file?.[0]?.filename;
    const showcaseImgs = files.showcase_files?.map(file => file.filename) || [];

    const project = await prisma.project.create({
      data: {
        name,
        desc,
        thumbnail_img: thumbnail ? (conversions[thumbnail] || thumbnail) : null,
        showcase_imgs: files.showcase_files?.map(file => conversions[file.filename] || file.filename) || [],
        featured: featured === 'true', // multer sends boolean values as strings
        skills: {
          create: skills?.map((skillName: string) => ({
            name: skillName,
          })) || [],
        },
      },
      include: {
        skills: true,
      },
    });
    res.status(201).json(project);
  } catch (error: any) {
    // cleanup
    // Delete any uploaded files if project creation fails

    res.status(500).json({ error: error.message });
  }
});

// PUT update project
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, desc, featured, skills } = req.body;

    // First, delete existing skills
    await prisma.skill.deleteMany({
      where: { projectId: id },
    });

    // Update project and create new skills
    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        desc,
        featured: featured !== undefined ? featured : false,
        skills: {
          create: skills?.map((skillName: string) => ({
            name: skillName,
          })) || [],
        },
      },
      include: {
        skills: true,
      },
    });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE project
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    // Delete skills first (due to foreign key constraint)
    await prisma.skill.deleteMany({
      where: { projectId: id },
    });
    
    // Delete project
    await prisma.project.delete({
      where: { id },
    });
    
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;