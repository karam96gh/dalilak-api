import dotenv from 'dotenv';
dotenv.config();

import { validateEnv } from './config/env';
import prisma from './config/database';
import app from './app';
import fs from 'fs';

async function main() {
    // Validate environment
    const env = validateEnv();

    // Create uploads directory
    if (!fs.existsSync(env.UPLOAD_DIR)) {
        fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });
    }

    // Connect to database
    await prisma.$connect();
    console.log('✅ Database connected');

    // Start server
    app.listen(env.PORT, () => {
        console.log(`🚀 Dalilak API running on port ${env.PORT}`);
        console.log(`📝 Environment: ${env.NODE_ENV}`);
    });
}

main().catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
});
