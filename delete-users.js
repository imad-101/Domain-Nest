// Quick script to delete all users
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteAllUsers() {
  try {
    // Delete related records first (due to foreign key constraints)
    await prisma.account.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.domain.deleteMany({});
    
    // Then delete all users
    const result = await prisma.user.deleteMany({});
    console.log(`Deleted ${result.count} users`);
    
  } catch (error) {
    console.error('Error deleting users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllUsers();
