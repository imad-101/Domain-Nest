// Create test data for health monitoring
const { PrismaClient } = require('@prisma/client');

async function createTestData() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Creating test data...');
    
    // First, let's check if there are any users
    const users = await prisma.user.findMany();
    console.log(`👥 Found ${users.length} users`);
    
    if (users.length === 0) {
      console.log('⚠️  No users found. You need to sign up first to test the health monitoring.');
      console.log('🌐 Visit: http://localhost:3001/register');
      return;
    }
    
    const user = users[0];
    console.log(`👤 Using user: ${user.email || user.name || user.id}`);
    
    // Create a test domain
    const testDomain = await prisma.domain.create({
      data: {
        userId: user.id,
        domainName: 'google.com',
        provider: 'test',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        isMonitored: true,
        sslExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        sslStatus: 'valid',
        sslIssuer: 'Google Trust Services'
      }
    });
    
    console.log('✅ Created test domain:', testDomain.domainName);
    
    // Create some sample uptime checks
    const now = new Date();
    for (let i = 0; i < 10; i++) {
      await prisma.uptimeCheck.create({
        data: {
          domainId: testDomain.id,
          timestamp: new Date(now.getTime() - i * 60 * 60 * 1000), // Every hour back
          isUp: Math.random() > 0.1, // 90% uptime
          responseTime: Math.floor(Math.random() * 500) + 100, // 100-600ms
          statusCode: Math.random() > 0.1 ? 200 : 500
        }
      });
    }
    
    // Create some sample performance metrics
    for (let i = 0; i < 10; i++) {
      await prisma.performanceMetric.create({
        data: {
          domainId: testDomain.id,
          timestamp: new Date(now.getTime() - i * 60 * 60 * 1000),
          responseTime: Math.floor(Math.random() * 500) + 100,
          ttfb: Math.floor(Math.random() * 200) + 50,
          domainLookup: Math.floor(Math.random() * 50) + 10,
          connect: Math.floor(Math.random() * 100) + 20,
          tlsHandshake: Math.floor(Math.random() * 150) + 30,
          contentTransfer: Math.floor(Math.random() * 200) + 50
        }
      });
    }
    
    console.log('✅ Created sample uptime checks and performance metrics');
    console.log('🎯 You can now test the health dashboard at: http://localhost:3001/dashboard/health');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();
