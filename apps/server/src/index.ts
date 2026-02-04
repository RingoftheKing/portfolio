import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection, disconnect } from './config/database.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import healthRouter from './routes/health.js';
import projectsRouter from './routes/projects.js';
import authRouter from './routes/auth.js';
import skillsRouter from './routes/skills.js';
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: [
    process.env.CORS_ORIGIN_CLIENT || 'http://localhost:3000',
    process.env.CORS_ORIGIN_ADMIN || 'http://localhost:3001',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/health', healthRouter);
app.use('/projects', projectsRouter);
app.use('/auth', authRouter);
app.use('/skills', skillsRouter);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Portfolio API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      projects: '/projects',
      auth: '/auth',
    },
  });
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.warn('Warning: Database connection failed. Server will start but database features may not work.');
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await disconnect();
  process.exit(0);
});

startServer();

