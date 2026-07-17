import { Router, Request, Response } from 'express';
import { prisma } from '../config/database.js';

const router = Router();

// POST contact form submission
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Save contact to DB OR call an email service to send the message (for now, just log it)
    // console.log(`Contact form submitted: Name: ${name}, Email: ${email}, Message: ${message}`);
    res.status(201).json({ message: `Thank you, ${name}! Your message has been received.` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

export default router;