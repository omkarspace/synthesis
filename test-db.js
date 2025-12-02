// Quick test script to check database connectivity and schema
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDb() {
    try {
        console.log('Testing database connection...');
        const count = await prisma.project.count();
        console.log(`✓ Database connected. Found ${count} projects`);
        
        // Try to fetch first project
        const project = await prisma.project.findFirst();
        if (project) {
            console.log('✓ First project:', JSON.stringify(project, null, 2));
        } else {
            console.log('✓ No projects found in database');
        }
    } catch (error) {
        console.error('✗ Database error:', error.message);
        console.error('Full error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testDb();
