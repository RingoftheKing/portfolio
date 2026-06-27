# Prisma Setup Guide

This server uses Prisma ORM for database management. This guide covers setup and common operations.

## Prerequisites

- PostgreSQL database running (via Docker Compose or locally)
- Node.js and npm installed

## Initial Setup

1. **Install dependencies:**
   ```bash
   cd apps/server
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` with your database credentials
   - Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`

3. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

4. **Run migrations:**
   ```bash
   npm run prisma:migrate
   ```
   This will create the database schema based on your `prisma/schema.prisma` file.

## Common Commands

### Development

```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create and apply a new migration
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

### Production

```bash
# Deploy migrations (without interactive prompts)
npm run prisma:migrate:deploy
```

## Schema Management

### Create a Migration

1. Update `prisma/schema.prisma` with your model changes
2. Run: `npm run prisma:migrate`
3. Enter a migration name when prompted
4. Prisma will generate SQL migration files in `prisma/migrations/`

### Example Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Using Prisma Client

Import and use Prisma Client in your code:

```typescript
import { prisma } from './config/database';

// Example query
const users = await prisma.user.findMany();

// Example create
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
  },
});
```

## Docker Integration

The Docker setup automatically:
- Generates Prisma Client during build
- Uses `DATABASE_URL` from environment variables
- Connects to the PostgreSQL service in Docker Compose

Make sure to run migrations after the database is ready:

```bash
docker-compose exec server npm run prisma:migrate:deploy
```

Or include migrations in your deployment process.

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Client API Reference](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Prisma Migrate Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)

