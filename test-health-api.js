// Test script for health monitoring APIs
const { PrismaClient } = require('@prisma/client');

async function testHealthAPIs() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing Prisma client...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check if models are available
    console.log('📊 Available Prisma models:');
    console.log('- uptimeCheck:', typeof prisma.uptimeCheck);
    console.log('- performanceMetric:', typeof prisma.performanceMetric);
    console.log('- domain:', typeof prisma.domain);
    
    // Check if domains exist
    const domains = await prisma.domain.findMany();
    console.log(`📋 Found ${domains.length} domains in database`);
    
    if (domains.length > 0) {
      console.log('🏷️  Sample domain:', {
        id: domains[0].id,
        domainName: domains[0].domainName,
        isMonitored: domains[0].isMonitored,
        healthScore: domains[0].healthScore,
        lastUptime: domains[0].lastUptime
      });
    }
    
    // Check uptime checks
    const uptimeChecks = await prisma.uptimeCheck.findMany();
    console.log(`📈 Found ${uptimeChecks.length} uptime checks`);
    
    // Check performance metrics  
    const performanceMetrics = await prisma.performanceMetric.findMany();
    console.log(`⚡ Found ${performanceMetrics.length} performance metrics`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testHealthAPIs();
