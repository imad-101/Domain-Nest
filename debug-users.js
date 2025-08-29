// Debug script to check users in database
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        lemonSqueezyVariantId: true,
        lemonSqueezySubscriptionId: true,
        lemonSqueezyCurrentPeriodEnd: true,
        createdAt: true,
      }
    });
    
    console.log('Users in database:', users.length);
    console.log('Users:', JSON.stringify(users, null, 2));
    
    const accounts = await prisma.account.findMany({
      select: {
        id: true,
        userId: true,
        provider: true,
      }
    });
    
    console.log('Accounts in database:', accounts.length);
    console.log('Accounts:', JSON.stringify(accounts, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugUsers();
