import { createApp } from './app.js';
import { config } from './config/index.js';
import { db } from './database/db.js';
import { seedDatabase } from './database/seed.js';

async function bootstrap() {
  console.log('--------------------------------------------------');
  console.log('  🎂 Whisk & Layers Backend Service Starting...   ');
  console.log('--------------------------------------------------');

  try {
    // 1. Initialize DB and seed initial data if required
    await seedDatabase();

    // 2. Create Express App
    const app = createApp();

    // 3. Start HTTP Server
    const server = app.listen(config.port, () => {
      console.log(`[Server] Whisk & Layers API running on http://localhost:${config.port}`);
      console.log(`[Server] Health check: http://localhost:${config.port}${config.apiPrefix}/health`);
      console.log(`[Server] Environment: ${config.env}`);
    });

    // Graceful Shutdown
    const shutdown = () => {
      console.log('\n[Server] Gracefully shutting down...');
      db.persistImmediate();
      server.close(() => {
        console.log('[Server] Closed remaining active connections.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('[Server Error] Fatal error during startup:', error);
    process.exit(1);
  }
}

bootstrap();
