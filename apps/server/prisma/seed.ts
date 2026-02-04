import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create sample admin user (username is unique, so upsert works)
  const adminUser = await prisma.adminPageUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'admin123', // In production, this should be hashed with bcrypt
      role: 1, // ADMIN role
    },
  });
  console.log('✅ Created/updated admin user:', adminUser.username);

  // Check if projects already exist
  const existingProjects = await prisma.project.findMany();
  
  if (existingProjects.length === 0) {
    // Create sample projects with skills
    const project1 = await prisma.project.create({
      data: {
        name: 'Portfolio Website',
        desc: 'A modern portfolio website built with Next.js, React, and TypeScript. Features responsive design, smooth animations, and a clean UI.',
        featured: true,
        skills: {
          create: [
            { name: 'Next.js' },
            { name: 'React' },
            { name: 'TypeScript' },
            { name: 'Tailwind CSS' },
          ],
        },
      },
    });
    console.log('✅ Created project:', project1.name);

    const project2 = await prisma.project.create({
      data: {
        name: 'E-Commerce Platform',
        desc: 'Full-stack e-commerce platform with user authentication, product management, shopping cart, and payment integration.',
        featured: false,
        skills: {
          create: [
            { name: 'Node.js' },
            { name: 'Express' },
            { name: 'PostgreSQL' },
            { name: 'Prisma' },
            { name: 'React' },
          ],
        },
      },
    });
    console.log('✅ Created project:', project2.name);

    const project3 = await prisma.project.create({
      data: {
        name: 'Machine Learning Pipeline',
        desc: 'End-to-end ML pipeline for image classification using TensorFlow and Python. Includes data preprocessing, model training, and deployment.',
        featured: true,
        skills: {
          create: [
            { name: 'Python' },
            { name: 'TensorFlow' },
            { name: 'Machine Learning' },
            { name: 'Data Science' },
          ],
        },
      },
    });
    console.log('✅ Created project:', project3.name);
  } else {
    console.log('ℹ️  Projects already exist, skipping project creation');
  }

  console.log('🎉 Seed completed successfully!');
  console.log('\n📝 Login credentials:');
  console.log('   Username: admin');
  console.log('   Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
