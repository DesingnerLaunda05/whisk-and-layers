import { Router, Request, Response } from 'express';
import { db } from '../database/db.js';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  let dbStatus = 'healthy';
  try {
    const testQuery = db.queryOne('SELECT 1 as ok');
    if (!testQuery || testQuery.ok !== 1) {
      dbStatus = 'degraded';
    }
  } catch (err) {
    dbStatus = 'unhealthy';
  }

  const memoryUsage = process.memoryUsage();

  return res.status(dbStatus === 'healthy' ? 200 : 503).json({
    status: dbStatus === 'healthy' ? 'pass' : 'fail',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: dbStatus,
    version: '1.0.0',
    memory: {
      heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
    },
  });
});

export default router;
