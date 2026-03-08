// This file owns SQLite setup and queries.
// Add new database reads and writes here, then register them in src/main/api.ts.

import Database from 'better-sqlite3';
import { app } from 'electron';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

import type { HelloMessage } from '../api';

let database: Database | null = null;

const getDatabase = (): Database => {
  if (database) {
    return database;
  }

  const userDataPath = app.getPath('userData');
  mkdirSync(userDataPath, { recursive: true });

  const databasePath = path.join(userDataPath, 'desktop-app-starter.db');
  const instance = new Database(databasePath);

  instance.pragma('journal_mode = WAL');
  instance.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY,
      text TEXT NOT NULL
    );
  `);

  const existingMessage = instance
    .prepare('SELECT COUNT(*) AS total FROM messages WHERE id = 1')
    .get() as { total: number };

  if (existingMessage.total === 0) {
    instance
      .prepare('INSERT INTO messages (id, text) VALUES (1, ?)')
      .run('Hello from SQLite!');
  }

  database = instance;
  return instance;
};

export const getHelloMessage = (): HelloMessage => {
  const row = getDatabase()
    .prepare('SELECT text FROM messages WHERE id = 1')
    .get() as { text: string };

  return {
    text: row.text,
    source: 'sqlite',
  };
};