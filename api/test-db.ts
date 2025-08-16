import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testDatabaseConnection() {
  console.log('Attempting to connect to the database...');
  try {
    await prisma.$connect();
    console.log('✅ Prisma connected successfully.');

    console.log('Attempting to fetch modules...');
    const modules = await prisma.module.findMany();
    console.log('✅ Successfully fetched modules. Result:', modules);

  } catch (error) {
    console.error('❌ An error occurred during the test:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
    console.log('Prisma disconnected.');
  }
}

testDatabaseConnection();