const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
  // ─── DB Import / Export ──────────────────────────────────────────
  importDb: () => electron.ipcRenderer.invoke('importDb'),
  exportDb: () => electron.ipcRenderer.invoke('exportDb'),

  // ─── CRUD ────────────────────────────────────────────────────────
  getTableData: () => electron.ipcRenderer.invoke('getTableData'),
  createRow: (row: any) => electron.ipcRenderer.invoke('createRow', row),
  updateRow: (row: any) => electron.ipcRenderer.invoke('updateRow', row),
  deleteRow: (id: number) => electron.ipcRenderer.invoke('deleteRow', id),
});
