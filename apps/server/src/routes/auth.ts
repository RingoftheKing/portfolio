import { Router, Request, Response } from 'express';
import { prisma } from '../config/database.js';

const router = Router();

// Simple login endpoint
// In production, use proper password hashing (bcrypt) and JWT tokens
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user in database
    const user = await prisma.adminPageUser.findFirst({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Simple password check (in production, use bcrypt.compare)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Return success (in production, generate JWT token)
    res.status(200).json({
      token: 'authenticated',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
