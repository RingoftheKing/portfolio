import { Router, Request, Response } from 'express';
import { prisma } from '../config/database.js';

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
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, desc, featured, skills } = req.body;
    
    if (!name || !desc) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const project = await prisma.project.create({
      data: {
        name,
        desc,
        featured: featured || false,
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
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