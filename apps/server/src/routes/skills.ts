import { Router, Request, Response } from 'express';
import { prisma } from '../config/database.js';

const router = Router();

// GET all unique skills (for autocomplete)
router.get('/', async (req: Request, res: Response) => {
  try {
    const skills = await prisma.skill.findMany({
      select: {
        name: true,
      },
      distinct: ['name'],
      orderBy: {
        name: 'asc',
      },
    });
    
    // Extract unique skill names
    const uniqueSkills = [...new Set(skills.map((s: { name: string }) => s.name))];
    res.status(200).json(uniqueSkills);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

export default router;
