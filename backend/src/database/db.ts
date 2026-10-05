import initSqlJs, { Database as SqlJsDatabase, SqlJsStatic } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { config } from '../config/index.js';

class DatabaseClient {
  private sqlJs: SqlJsStatic | null = null;
  private db: SqlJsDatabase | null = null;
  private isInitialized = false;
  private saveTimeout: NodeJS.Timeout | null = null;
  private inTransaction = false;

  public async init(): Promise<void> {
    if (this.isInitialized && this.db) return;

    this.sqlJs = await initSqlJs();
    const dbDir = path.dirname(config.dbFile);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    if (fs.existsSync(config.dbFile)) {
      const fileBuffer = fs.readFileSync(config.dbFile);
      this.db = new this.sqlJs.Database(fileBuffer);
    } else {
      this.db = new this.sqlJs.Database();
      this.persistImmediate();
    }

    this.isInitialized = true;
    console.log(`[Database] Relational SQL database initialized at: ${config.dbFile}`);
  }

  private ensureInit() {
    if (!this.db) {
      throw new Error('Database not initialized. Call await db.init() first.');
    }
  }

  public persistImmediate(): void {
    if (!this.db) return;
    try {
      const data = this.db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(config.dbFile, buffer);
    } catch (err) {
      console.error('[Database] Error persisting database to disk:', err);
    }
  }

  public schedulePersist(): void {
    if (this.inTransaction) return;
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.persistImmediate();
    }, 100);
  }

  public query<T = any>(sql: string, params: any[] = []): T[] {
    this.ensureInit();
    const stmt = this.db!.prepare(sql);
    try {
      if (params.length > 0) {
        stmt.bind(params);
      }
      const results: T[] = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject() as T);
      }
      return results;
    } finally {
      stmt.free();
    }
  }

  public queryOne<T = any>(sql: string, params: any[] = []): T | null {
    this.ensureInit();
    const results = this.query<T>(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  public execute(sql: string, params: any[] = []): { lastInsertRowid: number; changes: number } {
    this.ensureInit();
    if (params.length > 0) {
      this.db!.run(sql, params);
    } else {
      this.db!.run(sql);
    }

    const rowIdRes = this.queryOne<{ id: number }>('SELECT last_insert_rowid() as id');
    const changesRes = this.queryOne<{ count: number }>('SELECT changes() as count');
    const lastInsertRowid = rowIdRes?.id || 0;
    const changes = changesRes?.count || 0;

    this.schedulePersist();
    return { lastInsertRowid, changes };
  }

  public exec(sql: string): void {
    this.ensureInit();
    this.db!.exec(sql);
    this.persistImmediate();
  }

  public transaction<T>(fn: () => T): T {
    this.ensureInit();
    this.inTransaction = true;
    try {
      this.db!.exec('BEGIN TRANSACTION;');
      const result = fn();
      this.db!.exec('COMMIT;');
      this.inTransaction = false;
      this.persistImmediate();
      return result;
    } catch (error) {
      this.inTransaction = false;
      try {
        this.db!.exec('ROLLBACK;');
      } catch (rollbackErr) {
        // ignore if already rolled back
      }
      throw error;
    }
  }
}

export const db = new DatabaseClient();
