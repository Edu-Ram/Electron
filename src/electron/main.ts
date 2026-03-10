import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import {
  importDatabase,
  exportDatabase,
  getRows,
  createRow,
  updateRow,
  deleteRow,
} from './dbManager.js';
import path from 'path';
import { isDev } from './util.js';
import { getPreloadPath } from './pathResolver.js';

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  // ─── Cargar UI ───────────────────────────────────────────────────
  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123');
  } else {
    mainWindow.loadFile(path.join(app.getAppPath() + '/dist-react/index.html'));
  }

  // ─── Import / Export DB ──────────────────────────────────────────
  ipcMain.handle('importDb', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [{ name: 'SQLite', extensions: ['sqlite', 'db'] }],
    });

    if (result.canceled || result.filePaths.length === 0)
      return { success: false, message: 'Cancelado' };

    try {
      importDatabase(result.filePaths[0]);
      return { success: true, message: 'Base de datos importada correctamente' };
    } catch (e) {
      return { success: false, message: 'Error al importar: ' + String(e) };
    }
  });

  ipcMain.handle('exportDb', async () => {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: 'data.sqlite',
      filters: [{ name: 'SQLite', extensions: ['sqlite', 'db'] }],
    });

    if (result.canceled || !result.filePath)
      return { success: false, message: 'Cancelado' };

    try {
      exportDatabase(result.filePath);
      return { success: true, message: 'Base de datos exportada correctamente' };
    } catch (e) {
      return { success: false, message: 'Error al exportar: ' + String(e) };
    }
  });

  // ─── CRUD ────────────────────────────────────────────────────────
  ipcMain.handle('getTableData', () => getRows());

  ipcMain.handle('createRow', (_event, row: RowInput) => {
    try {
      createRow(row);
      return { success: true, message: 'Registro creado' };
    } catch (e) {
      return { success: false, message: 'Error al crear: ' + String(e) };
    }
  });

  ipcMain.handle('updateRow', (_event, row: Row) => {
    try {
      updateRow(row);
      return { success: true, message: 'Registro actualizado' };
    } catch (e) {
      return { success: false, message: 'Error al actualizar: ' + String(e) };
    }
  });

  ipcMain.handle('deleteRow', (_event, id: number) => {
    try {
      deleteRow(id);
      return { success: true, message: 'Registro eliminado' };
    } catch (e) {
      return { success: false, message: 'Error al eliminar: ' + String(e) };
    }
  });
});