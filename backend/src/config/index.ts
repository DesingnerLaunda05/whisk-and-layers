import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  apiPrefix: process.env.API_PREFIX || '/api',
  
  // Database
  dbClient: (process.env.DB_CLIENT || 'sqlite') as 'sqlite' | 'mysql',
  dbFile: process.env.DB_FILE || path.resolve(process.cwd(), 'data/whisk_layers.sqlite'),
  mysql: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'whisk_layers',
  },

  // Auth & Security
  jwtSecret: process.env.JWT_SECRET || 'whisk_and_layers_fallback_secret_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // Uploads
  uploadDir: process.env.UPLOAD_DIR || path.resolve(process.cwd(), 'uploads'),
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '5', 10),
};
