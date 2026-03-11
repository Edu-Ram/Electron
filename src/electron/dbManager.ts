import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import { isDev } from './util.js';

export function getDbPath(): string {
  const base = isDev()
    ? app.getAppPath()
    : path.dirname(app.getPath('exe'));
  return path.join(base, 'data.sqlite');
}

// ─── Import / Export ────────────────────────────────────────────────

export function importDatabase(sourcePath: string): void {
  fs.copyFileSync(sourcePath, getDbPath());
}

export function exportDatabase(destPath: string): void {
  const dbPath = getDbPath();
  if (!fs.existsSync(dbPath)) throw new Error('No hay base de datos para exportar.');
  fs.copyFileSync(dbPath, destPath);
}

// ─── Read ────────────────────────────────────────────────────────────

export function getRows(): Row[] {
  const dbPath = getDbPath();
  if (!fs.existsSync(dbPath)) return [];

  const db = new Database(dbPath, { readonly: true });
  const rows = db.prepare('SELECT id, name, mensaje FROM datos').all() as Row[];
  db.close();
  return rows;
}

// ─── Create ──────────────────────────────────────────────────────────

export function createRow(row: RowInput): void {
  const db = new Database(getDbPath());
  db.prepare('INSERT INTO datos (name, mensaje) VALUES (?, ?)').run(row.name, row.mensaje);
  db.close();
}

// ─── Update ──────────────────────────────────────────────────────────

export function updateRow(row: Row): void {
  const db = new Database(getDbPath());
  db.prepare('UPDATE datos SET name = ?, mensaje = ? WHERE id = ?').run(row.name, row.mensaje, row.id);
  db.close();
}

// ─── Delete ──────────────────────────────────────────────────────────

export function deleteRow(id: number): void {
  const db = new Database(getDbPath());
  db.prepare('DELETE FROM datos WHERE id = ?').run(id);
  db.close();
}